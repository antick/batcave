import {
  BOOKMARKS_PATH,
  DIRECTORY,
  DIRECTORY_DEFAULT_ICON,
  DIRECTORY_PAGE_COPY,
  getBookmarkCountLabel,
} from './directory';
import {
  MOVIES,
  MOVIES_DEFAULT_ICON,
  MOVIES_PAGE_COPY,
  MOVIES_PATH,
} from './movies';
import {
  getMusicCountLabel,
  MUSIC_DEFAULT_ICON,
  MUSIC_PATH,
  MUSIC_TRACKS,
} from './music';
import { getRatingCountLabel } from './ratings';
import {
  READING,
  READING_DEFAULT_ICON,
  READING_PAGE_COPY,
  READING_PATH,
} from './reading';
import {
  TV_SHOWS,
  TV_SHOWS_DEFAULT_ICON,
  TV_SHOWS_PAGE_COPY,
  TV_SHOWS_PATH,
} from './tvShows';
import { WISHLIST, WISHLIST_DEFAULT_ICON, WISHLIST_PATH } from './wishlist';

export const SHELF_PATH = '/shelf';
export const SHELF_DEFAULT_ICON = 'fa-solid fa-layer-group';

export const SHELF_PAGE_COPY = {
  title: 'Shelf',
  subtitle: 'Bookmarks, Wishlist, Movies, TV Shows, Reading, and Music',
  intro:
    'References for the Batcomputer, upgrades for the cave, and the things I read or watch when Alfred orders a night off.',
  searchDescription:
    'A fictional look at Bruce Wayne’s bookmarks, gadgets, reading, films, and music.',
} as const;

export const HOME_SHELF_COPY = {
  label: '// on the shelf',
  action: 'Open the shelf',
  emptyLabel: 'Coming soon',
} as const;

export const SHELF_NAV_ITEM = {
  id: 'shelf' as const,
  label: SHELF_PAGE_COPY.title,
  icon: SHELF_DEFAULT_ICON,
  href: SHELF_PATH,
};

export interface ShelfCard {
  id: 'bookmarks' | 'wishlist' | 'movies' | 'tv-shows' | 'reading' | 'music';
  href: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  countLabel: string;
}

export function getShelfCards({
  bookmarkCount,
  wishlistCount,
  movieCount,
  tvShowCount,
  readingCount,
  musicCount,
}: {
  bookmarkCount: number;
  wishlistCount: number;
  movieCount: number;
  tvShowCount: number;
  readingCount: number;
  musicCount: number;
}): ShelfCard[] {
  return [
    {
      id: 'bookmarks',
      href: BOOKMARKS_PATH,
      title: DIRECTORY_PAGE_COPY.title,
      description: DIRECTORY_PAGE_COPY.subtitle,
      icon: DIRECTORY_DEFAULT_ICON,
      count: bookmarkCount,
      countLabel: getBookmarkCountLabel(bookmarkCount),
    },
    {
      id: 'wishlist',
      href: WISHLIST_PATH,
      title: 'Wishlist',
      description:
        'Cave upgrades, quieter gadgets, and coffee that stays warm.',
      icon: WISHLIST_DEFAULT_ICON,
      count: wishlistCount,
      countLabel: wishlistCount === 1 ? '1 item' : `${wishlistCount} items`,
    },
    {
      id: 'movies',
      href: MOVIES_PATH,
      title: MOVIES_PAGE_COPY.title,
      description: MOVIES_PAGE_COPY.subtitle,
      icon: MOVIES_DEFAULT_ICON,
      count: movieCount,
      countLabel: getRatingCountLabel(movieCount, MOVIES_PAGE_COPY),
    },
    {
      id: 'tv-shows',
      href: TV_SHOWS_PATH,
      title: TV_SHOWS_PAGE_COPY.title,
      description: TV_SHOWS_PAGE_COPY.subtitle,
      icon: TV_SHOWS_DEFAULT_ICON,
      count: tvShowCount,
      countLabel: getRatingCountLabel(tvShowCount, TV_SHOWS_PAGE_COPY),
    },
    {
      id: 'reading',
      href: READING_PATH,
      title: READING_PAGE_COPY.title,
      description: READING_PAGE_COPY.subtitle,
      icon: READING_DEFAULT_ICON,
      count: readingCount,
      countLabel: getRatingCountLabel(readingCount, READING_PAGE_COPY),
    },
    {
      id: 'music',
      href: MUSIC_PATH,
      title: 'Music',
      description:
        'Imaginary soundtracks for rooftops, workshops, and the ride home.',
      icon: MUSIC_DEFAULT_ICON,
      count: musicCount,
      countLabel: getMusicCountLabel(musicCount),
    },
  ];
}

/** Shelf cards counted from the site's published collections. */
export function getSiteShelfCards(): ShelfCard[] {
  return getShelfCards({
    bookmarkCount: DIRECTORY.length,
    wishlistCount: WISHLIST.length,
    movieCount: MOVIES.length,
    tvShowCount: TV_SHOWS.length,
    readingCount: READING.length,
    musicCount: MUSIC_TRACKS.length,
  });
}
