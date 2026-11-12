import type { ContentCategory } from './types';
import { toCategoryId } from './utils';

export const RATING_ALL_CATEGORY_ID = 'all';
export const RATING_MAX = 5;
export const RATING_UNRATED_MARK = '–';
export const RATING_WATCHED_STATUS = 'watched';
export const RATING_QUEUED_STATUS = 'queued';

export type RatingStatus =
  | typeof RATING_WATCHED_STATUS
  | typeof RATING_QUEUED_STATUS;

export interface RatingEntry {
  id: string;
  title: string;
  genre: string;
  rating?: number;
  review?: string;
  status: RatingStatus;
}

export interface RatingShelf {
  id: string;
  label: string;
  description: string;
  icon: string;
  entries: RatingEntry[];
}

export interface RatingCollectionCopy {
  title: string;
  subtitle: string;
  allDescription: string;
  subjectIndexLabel: string;
  searchDescription: string;
  itemSingular: string;
  itemPlural: string;
  watchedTitle: string;
  watchedEmpty: string;
  queuedTitle: string;
  queuedEmpty: string;
}

interface RatingDraft {
  title: string;
  genre: string;
  rating?: number;
  review?: string;
  status?: RatingStatus;
}

export function getRatingItemId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getRatingScoreLabel(rating?: number): string {
  const value = rating == null ? RATING_UNRATED_MARK : String(rating);
  return `${value}/${RATING_MAX}`;
}

export function getRatingItemPath(
  path: string,
  item: Pick<RatingEntry, 'id'>,
): string {
  return `${path}#${item.id}`;
}

export function getRatingCountLabel(
  count: number,
  copy: Pick<RatingCollectionCopy, 'itemSingular' | 'itemPlural'>,
): string {
  return count === 1 ? `1 ${copy.itemSingular}` : `${count} ${copy.itemPlural}`;
}

export function hydrateRatingEntries(drafts: RatingDraft[]): RatingEntry[] {
  const seen = new Set<string>();

  return drafts.map((draft) => {
    const status = draft.status ?? RATING_WATCHED_STATUS;
    if (
      status === RATING_WATCHED_STATUS &&
      (draft.rating == null || draft.rating < 1 || draft.rating > RATING_MAX)
    ) {
      throw new Error(`Invalid rating for ${draft.title}: ${draft.rating}`);
    }

    const id = getRatingItemId(draft.title);
    if (seen.has(id)) {
      throw new Error(`Duplicate rating id: ${id}`);
    }
    seen.add(id);

    return { ...draft, id, status };
  });
}

export function isRatingWatched(entry: Pick<RatingEntry, 'status'>): boolean {
  return entry.status === RATING_WATCHED_STATUS;
}

export function splitRatingEntries(entries: RatingEntry[]): {
  watched: RatingEntry[];
  queued: RatingEntry[];
} {
  return {
    watched: entries.filter((entry) => isRatingWatched(entry)),
    queued: entries.filter((entry) => !isRatingWatched(entry)),
  };
}

export interface RatingGenrePreset {
  label: string;
  description?: string;
  icon?: string;
}

export function buildRatingShelves({
  entries,
  copy,
  icon,
  path,
  presetGenres = [],
}: {
  entries: RatingEntry[];
  copy: RatingCollectionCopy;
  icon: string;
  path: string;
  presetGenres?: RatingGenrePreset[];
}): {
  shelves: RatingShelf[];
  navShelves: RatingShelf[];
  categories: ContentCategory[];
  getPath: (category: Pick<ContentCategory, 'id'>) => string;
  getShelf: (categoryId: string) => RatingShelf | undefined;
} {
  const presetLabels = presetGenres.map((genre) => genre.label);
  const discoveredGenres = [
    ...new Set(entries.map((entry) => entry.genre)),
  ].sort((first, second) => first.localeCompare(second));
  const genres: RatingGenrePreset[] = [
    ...presetGenres,
    ...discoveredGenres
      .filter((genre) => !presetLabels.includes(genre))
      .map((genre) => ({ label: genre })),
  ];

  const shelves: RatingShelf[] = genres.map((genre) => {
    const id = toCategoryId(genre.label);
    if (id === RATING_ALL_CATEGORY_ID || id === 'page') {
      throw new Error(`Rating genre id is reserved: ${id}`);
    }

    return {
      id,
      label: genre.label,
      description: genre.description ?? `${genre.label} ${copy.itemPlural}.`,
      icon: genre.icon ?? icon,
      entries: sortRatingEntries(
        entries.filter((entry) => entry.genre === genre.label),
      ),
    };
  });

  const allShelf: RatingShelf = {
    id: RATING_ALL_CATEGORY_ID,
    label: 'All',
    description: copy.allDescription,
    icon,
    entries: sortRatingEntries(entries),
  };

  const navShelves = [allShelf, ...shelves];
  const categories = shelves.map(
    ({ id, label, description, icon: shelfIcon }) => ({
      id,
      label,
      description,
      icon: shelfIcon,
    }),
  );

  function getPath(category: Pick<ContentCategory, 'id'>): string {
    return category.id === RATING_ALL_CATEGORY_ID
      ? path
      : `${path}/${category.id}`;
  }

  function getShelf(categoryId: string): RatingShelf | undefined {
    return navShelves.find((shelf) => shelf.id === categoryId);
  }

  return { shelves, navShelves, categories, getPath, getShelf };
}

function sortRatingEntries(entries: RatingEntry[]): RatingEntry[] {
  return [...entries].sort((first, second) => {
    const ratingDelta = (second.rating ?? 0) - (first.rating ?? 0);
    return ratingDelta || first.title.localeCompare(second.title);
  });
}
