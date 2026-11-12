import { ABOUT_INTERESTS_PERSONAL, ABOUT_STORY } from './about';
import {
  BLOG_INDEX_PATH,
  FEATURED_WRITING_PATH,
  getArticlePath,
} from './articleRoutes';
import { BOOKS_PAGE_COPY, BOOKS_PATH } from './books';
import {
  DIRECTORY,
  DIRECTORY_PAGE_COPY,
  DIRECTORY_PATH,
  getDirectoryHostname,
} from './directory';
import { BLOG_PAGE_COPY } from './constants';
import { TAGS_PAGE_COPY, TAGS_PATH } from './tags';
import {
  CONTACT_PAGE_COPY,
  CONTACT_PATH,
  CONTACT_SEARCH_TAGS,
} from './contact';
import { getContentDisplayTitle } from './content';
import { FEATURED_WRITING_PAGE_COPY } from './home';
import { getListArticleSearchText } from './listArticle';
import {
  getProjectPath,
  getVisibleProjects,
  PROJECTS_PAGE_COPY,
} from './projects';
import { MUSIC_PAGE_COPY, MUSIC_PATH, MUSIC_TRACKS } from './music';
import { READING, READING_PAGE_COPY, READING_PATH } from './reading';
import { MOVIES, MOVIES_PAGE_COPY, MOVIES_PATH } from './movies';
import { getRatingItemPath, getRatingScoreLabel } from './ratings';
import { SHELF_PAGE_COPY, SHELF_PATH } from './shelf';
import { TV_SHOWS, TV_SHOWS_PAGE_COPY, TV_SHOWS_PATH } from './tvShows';

import {
  getWishlistItemPath,
  WISHLIST,
  WISHLIST_PAGE_COPY,
  WISHLIST_PATH,
} from './wishlist';

const ABOUT_INTERESTS = ABOUT_INTERESTS_PERSONAL;

export const SEARCH_INDEX_PATH = '/search-index.json';
export const SEARCH_QUERY_PARAM = 'q';
export const SEARCH_MIN_QUERY_LENGTH = 2;

export type SearchEntryType =
  | 'Page'
  | 'Post'
  | 'Project'
  | 'Bookmark'
  | 'Wishlist'
  | 'Movie'
  | 'Show'
  | 'Music'
  | 'Reading';

export interface BlogSearchPost {
  id: string;
  body?: string;
  data: {
    title: string;
    description: string;
    excerpt: string;
    pubDate: Date;
    tags?: string[];
    slug: string;
    draft: boolean;
    category: string;
    prompt?: {
      useCase: string;
      details: string[];
    };
    list?: {
      layout?: 'detailed' | 'compact';
      items: Array<{
        title: string;
        description?: string;
        meta?: string;
        group?: string;
      }>;
    };
  };
}

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  type: SearchEntryType;
  category?: string;
  tags: string[];
  searchableText: string;
}

export interface SearchResult extends SearchEntry {
  score: number;
}

const STATIC_PAGE_ENTRIES: SearchEntry[] = [
  createEntry(
    'page-home',
    'Home',
    'Main identity card, blog categories, site activity, other writing, and contact paths.',
    '/',
    'Page',
    ['home', 'contact'],
  ),
  createEntry(
    'page-about',
    'About',
    'A closer look at the person behind the work.',
    '/about',
    'Page',
    ABOUT_INTERESTS,
  ),
  createEntry(
    'page-projects',
    'Projects',
    PROJECTS_PAGE_COPY.searchDescription,
    '/projects',
    'Page',
    ['projects', 'portfolio'],
  ),
  createEntry(
    'page-blog',
    BLOG_PAGE_COPY.title,
    BLOG_PAGE_COPY.searchDescription,
    BLOG_INDEX_PATH,
    'Page',
    ['blog', 'posts', 'writing', 'life'],
  ),
  createEntry(
    'page-featured',
    FEATURED_WRITING_PAGE_COPY.title,
    FEATURED_WRITING_PAGE_COPY.subtitle,
    FEATURED_WRITING_PATH,
    'Page',
    ['featured', 'posts', 'writing'],
  ),
  createEntry(
    'page-tags',
    TAGS_PAGE_COPY.title,
    TAGS_PAGE_COPY.searchDescription,
    TAGS_PATH,
    'Page',
    ['tags', 'topics', 'posts', 'writing'],
  ),
  createEntry(
    'page-books',
    BOOKS_PAGE_COPY.title,
    BOOKS_PAGE_COPY.searchDescription,
    BOOKS_PATH,
    'Page',
    ['books', 'writing', 'software', 'practice'],
  ),
  createEntry(
    'page-bookmarks',
    DIRECTORY_PAGE_COPY.title,
    DIRECTORY_PAGE_COPY.searchDescription,
    DIRECTORY_PATH,
    'Page',
    ['bookmarks', 'directory', 'links', 'references'],
  ),
  createEntry(
    'page-contact',
    CONTACT_PAGE_COPY.title,
    CONTACT_PAGE_COPY.subtitle,
    CONTACT_PATH,
    'Page',
    ['contact', 'social', 'community', ...CONTACT_SEARCH_TAGS],
  ),
  createEntry(
    'page-wishlist',
    WISHLIST_PAGE_COPY.title,
    WISHLIST_PAGE_COPY.searchDescription,
    WISHLIST_PATH,
    'Page',
    ['wishlist', 'wants', 'gifts'],
  ),
  createEntry(
    'page-music',
    MUSIC_PAGE_COPY.title,
    MUSIC_PAGE_COPY.searchDescription,
    MUSIC_PATH,
    'Page',
    ['music', 'playlists', 'youtube'],
  ),
  createEntry(
    'page-shelf',
    SHELF_PAGE_COPY.title,
    SHELF_PAGE_COPY.searchDescription,
    SHELF_PATH,
    'Page',
    [
      'shelf',
      'bookmarks',
      'wishlist',
      'movies',
      'tv-shows',
      'reading',
      'music',
    ],
  ),
  createEntry(
    'page-movies',
    MOVIES_PAGE_COPY.title,
    MOVIES_PAGE_COPY.searchDescription,
    MOVIES_PATH,
    'Page',
    ['movies', 'ratings', 'reviews', 'cinema'],
  ),
  createEntry(
    'page-reading',
    READING_PAGE_COPY.title,
    READING_PAGE_COPY.searchDescription,
    READING_PATH,
    'Page',
    ['reading', 'books', 'library'],
  ),
  createEntry(
    'page-tv-shows',
    TV_SHOWS_PAGE_COPY.title,
    TV_SHOWS_PAGE_COPY.searchDescription,
    TV_SHOWS_PATH,
    'Page',
    ['tv', 'shows', 'ratings', 'reviews', 'television'],
  ),
];

export function buildSearchIndex(posts: BlogSearchPost[]): SearchEntry[] {
  return [
    ...STATIC_PAGE_ENTRIES,
    ...buildAboutEntries(),
    ...posts.map(buildPostEntry),
    ...getVisibleProjects().map((project) =>
      createEntry(
        `project-${slugify(project.title)}`,
        project.title,
        project.description,
        getProjectPath(project),
        'Project',
        [...project.tags, ...project.highlights],
        project.status,
      ),
    ),
    ...DIRECTORY.map((entry) =>
      createEntry(
        `bookmark-${slugify(entry.title)}`,
        entry.title,
        entry.description ?? getDirectoryHostname(entry.url),
        entry.url,
        'Bookmark',
        [entry.category],
        entry.category,
      ),
    ),
    ...WISHLIST.map((entry) =>
      createEntry(
        `wishlist-${entry.id}`,
        entry.title,
        entry.why,
        getWishlistItemPath(entry),
        'Wishlist',
        [entry.category, entry.priceNote ?? '', entry.status],
        entry.category,
      ),
    ),
    ...MUSIC_TRACKS.map((track) =>
      createEntry(
        `music-${track.id}`,
        track.title,
        track.note ?? MUSIC_PAGE_COPY.openLabel,
        `${MUSIC_PATH}#${track.id}`,
        'Music',
        [track.youtubeId ?? '', track.note ?? ''],
        MUSIC_PAGE_COPY.title,
      ),
    ),
    ...MOVIES.map((entry) =>
      createEntry(
        `movie-${entry.id}`,
        entry.title,
        entry.review ?? MOVIES_PAGE_COPY.queuedTitle,
        getRatingItemPath(MOVIES_PATH, entry),
        'Movie',
        [entry.genre, getRatingScoreLabel(entry.rating)],
        entry.genre,
      ),
    ),
    ...TV_SHOWS.map((entry) =>
      createEntry(
        `show-${entry.id}`,
        entry.title,
        entry.review ?? TV_SHOWS_PAGE_COPY.queuedTitle,
        getRatingItemPath(TV_SHOWS_PATH, entry),
        'Show',
        [entry.genre, getRatingScoreLabel(entry.rating)],
        entry.genre,
      ),
    ),
    ...READING.map((entry) =>
      createEntry(
        `reading-${entry.id}`,
        entry.title,
        entry.review ?? READING_PAGE_COPY.queuedTitle,
        getRatingItemPath(READING_PATH, entry),
        'Reading',
        [entry.genre, getRatingScoreLabel(entry.rating)],
        entry.genre,
      ),
    ),
  ];
}

export function serializeSearchIndex(entries: SearchEntry[]): string {
  return JSON.stringify(entries).replace(/</g, '\\u003c');
}

function buildAboutEntries(): SearchEntry[] {
  return [
    createEntry(
      'about-story',
      'A closer look at the person behind the work.',
      ABOUT_STORY.join(' '),
      '/about',
      'Page',
      ABOUT_INTERESTS,
      'About',
    ),
  ];
}

function buildPostEntry(post: BlogSearchPost): SearchEntry {
  const tags = post.data.tags ?? [];
  const category = post.data.category;

  return createEntry(
    `post-${post.id}`,
    getContentDisplayTitle(post),
    post.data.excerpt,
    getArticlePath(post.data),
    'Post',
    [
      ...tags,
      ...(post.data.prompt?.details ?? []),
      post.data.prompt?.useCase ?? '',
      ...(post.data.list ? getListArticleSearchText(post.data.list) : []),
      post.body ?? '',
    ],
    category,
  );
}

function createEntry(
  id: string,
  title: string,
  description: string,
  href: string,
  type: SearchEntryType,
  tags: string[],
  category?: string,
): SearchEntry {
  const searchableText = [title, description, type, category, ...tags]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return { id, title, description, href, type, category, tags, searchableText };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
