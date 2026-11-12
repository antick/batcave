import { useEffect, useMemo, useRef, useState } from 'react';
import { SEARCH_PAGE_LIMIT, SEARCH_PREVIEW_LIMIT } from '../lib/config';
import {
  SEARCH_ARIA_LABEL,
  SEARCH_PAGE_PLACEHOLDER,
  SEARCH_PLACEHOLDER,
} from '../lib/constants';
import {
  SEARCH_INDEX_PATH,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_QUERY_PARAM,
  type SearchEntry,
  type SearchResult,
} from '../lib/search';

interface Props {
  variant?: 'nav' | 'page';
  autoFocus?: boolean;
}

type SearchIndexStatus = 'idle' | 'loading' | 'ready' | 'error';

export default function SearchBox({
  variant = 'nav',
  autoFocus = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [indexStatus, setIndexStatus] = useState<SearchIndexStatus>('idle');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const isPage = variant === 'page';
  const results = useMemo(
    () =>
      searchEntries(
        entries,
        query,
        isPage ? SEARCH_PAGE_LIMIT : SEARCH_PREVIEW_LIMIT,
      ),
    [entries, isPage, query],
  );
  const hasQuery = query.trim().length >= SEARCH_MIN_QUERY_LENGTH;

  useEffect(() => {
    if (isPage) {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get(SEARCH_QUERY_PARAM) ?? '');
    }
  }, [isPage]);

  useEffect(() => {
    if (!isPage && !isOpen) {
      return;
    }

    let isActive = true;
    setIndexStatus('loading');

    loadSearchIndex()
      .then((searchEntries) => {
        if (!isActive) {
          return;
        }

        setEntries(searchEntries);
        setIndexStatus('ready');
      })
      .catch(() => {
        if (isActive) {
          setIndexStatus('error');
        }
      });

    return () => {
      isActive = false;
    };
  }, [isOpen, isPage]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (!isShortcut) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
      setIsOpen(true);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
      inputRef.current?.focus();
      return;
    }

    window.location.href = `/search?${SEARCH_QUERY_PARAM}=${encodeURIComponent(trimmedQuery)}`;
  }

  function onInputBlur() {
    window.setTimeout(() => setIsOpen(false), 140);
  }

  function openNavSearch() {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  if (!isPage) {
    return (
      <div
        className="site-search site-search-nav"
        data-open={isOpen || undefined}
      >
        <button
          type="button"
          className="site-search-trigger"
          aria-label="Open site search"
          aria-expanded={isOpen}
          onClick={openNavSearch}
        >
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        </button>

        {isOpen && (
          <div className="site-search-popover">
            <form
              className="site-search-form"
              role="search"
              aria-label="Site search"
              onSubmit={onSubmit}
            >
              <i
                className="fa-solid fa-magnifying-glass site-search-icon"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                className="site-search-input"
                type="search"
                value={query}
                placeholder={SEARCH_PLACEHOLDER}
                aria-label={SEARCH_ARIA_LABEL}
                onChange={(event) => setQuery(event.target.value)}
                onBlur={onInputBlur}
              />
            </form>

            <SearchResultsPanel
              query={query}
              results={results}
              hasQuery={hasQuery}
              indexStatus={indexStatus}
              totalMatches={
                searchEntries(entries, query, SEARCH_PAGE_LIMIT).length
              }
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`site-search site-search-${variant}`}
      data-open={isOpen || undefined}
    >
      <form
        className="site-search-form"
        role="search"
        aria-label="Site search"
        onSubmit={onSubmit}
      >
        <i
          className="fa-solid fa-magnifying-glass site-search-icon"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          className="site-search-input"
          type="search"
          value={query}
          placeholder={isPage ? SEARCH_PAGE_PLACEHOLDER : SEARCH_PLACEHOLDER}
          aria-label={SEARCH_ARIA_LABEL}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={onInputBlur}
        />
      </form>

      <SearchResultsPanel
        query={query}
        results={results}
        hasQuery={hasQuery}
        indexStatus={indexStatus}
        isPage
      />
    </div>
  );
}

function SearchResultsPanel({
  query,
  results,
  hasQuery,
  indexStatus,
  totalMatches,
  isPage = false,
}: {
  query: string;
  results: SearchResult[];
  hasQuery: boolean;
  indexStatus: SearchIndexStatus;
  totalMatches?: number;
  isPage?: boolean;
}) {
  const resultLabel = results.length === 1 ? 'result' : 'results';

  return (
    <div className="site-search-results" role="region" aria-live="polite">
      {indexStatus === 'error' ? (
        <p className="site-search-empty">
          Search is temporarily unavailable. Please try again.
        </p>
      ) : hasQuery ? (
        indexStatus !== 'ready' ? (
          <p className="site-search-empty">Loading search…</p>
        ) : (
          <>
            <div className="site-search-results-head">
              <span>
                {results.length} {resultLabel}
              </span>
              {!isPage && totalMatches && totalMatches > results.length && (
                <a
                  href={`/search?${SEARCH_QUERY_PARAM}=${encodeURIComponent(query.trim())}`}
                >
                  View all {totalMatches}
                </a>
              )}
            </div>

            {results.length > 0 ? (
              <div className="site-search-list">
                {results.map((result) => (
                  <SearchResultItem key={result.id} result={result} />
                ))}
              </div>
            ) : (
              <p className="site-search-empty">
                No matches yet. Try a broader word or a category like
                engineering, practice, AI, or tools.
              </p>
            )}
          </>
        )
      ) : (
        <p className="site-search-empty">
          Type at least {SEARCH_MIN_QUERY_LENGTH} characters to search posts,
          projects, books, bookmarks, wishlist, movies, and About.
        </p>
      )}
    </div>
  );
}

function SearchResultItem({ result }: { result: SearchResult }) {
  const isExternal = /^https?:\/\//.test(result.href);

  return (
    <a
      className="site-search-result"
      href={result.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <span className="site-search-result-main">
        <span className="site-search-result-title">{result.title}</span>
        <span className="site-search-result-desc">{result.description}</span>
      </span>
      <span className="site-search-result-meta">
        <span>{result.category ?? result.type}</span>
        <i
          className={
            isExternal
              ? 'fa-solid fa-arrow-up-right-from-square'
              : 'fa-solid fa-arrow-right'
          }
          aria-hidden="true"
        />
      </span>
    </a>
  );
}

let searchIndexPromise: Promise<SearchEntry[]> | undefined;

function loadSearchIndex(): Promise<SearchEntry[]> {
  searchIndexPromise ??= fetch(SEARCH_INDEX_PATH)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Search index request failed with ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('Search index response is not an array');
      }

      return data as SearchEntry[];
    })
    .catch((error) => {
      searchIndexPromise = undefined;
      throw error;
    });

  return searchIndexPromise;
}

function searchEntries(
  entries: SearchEntry[],
  query: string,
  limit: number,
): SearchResult[] {
  const normalizedQuery = normalize(query);

  if (normalizedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
    return [];
  }

  const terms = normalizedQuery.split(' ').filter(Boolean);

  return entries
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry, normalizedQuery, terms),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

function scoreEntry(
  entry: SearchEntry,
  query: string,
  terms: string[],
): number {
  const title = normalize(entry.title);
  const description = normalize(entry.description);
  const tags = normalize(entry.tags.join(' '));
  const haystack = normalize(entry.searchableText);

  if (!terms.every((term) => haystack.includes(term))) {
    return 0;
  }

  let score = 10;

  if (title === query) score += 120;
  if (title.startsWith(query)) score += 80;
  if (title.includes(query)) score += 60;
  if (description.includes(query)) score += 32;
  if (tags.includes(query)) score += 28;

  terms.forEach((term) => {
    if (title.includes(term)) score += 18;
    if (description.includes(term)) score += 8;
    if (tags.includes(term)) score += 10;
  });

  return score;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
