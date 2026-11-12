import { BOOKS_PATH } from './books';
import type { HomeWritingItem } from './home';
import type { OpenSourceProject } from './openSource';

export const HOME_NOW_COPY = {
  label: '// now',
  building: 'Building',
  writing: 'Writing',
  latestPost: 'Latest post',
  books: (count: number) =>
    count === 1 ? 'a book between patrols' : `${count} books between patrols`,
} as const;

export interface HomeNowItem {
  id: string;
  icon: string;
  lead: string;
  text: string;
  href: string;
  external?: boolean;
}

interface HomeNowOptions {
  spotlight?: OpenSourceProject;
  bookCount: number;
  latestPost?: HomeWritingItem;
}

/** Derives the homepage Now card from existing site data so it never goes stale. */
export function buildHomeNow({
  spotlight,
  bookCount,
  latestPost,
}: HomeNowOptions): HomeNowItem[] {
  const items: HomeNowItem[] = [];

  if (spotlight) {
    items.push({
      id: 'building',
      icon: 'fa-solid fa-hammer',
      lead: HOME_NOW_COPY.building,
      text: spotlight.title,
      href: spotlight.externalLink?.href ?? spotlight.href,
      external: true,
    });
  }

  if (bookCount > 0) {
    items.push({
      id: 'writing',
      icon: 'fa-solid fa-feather',
      lead: HOME_NOW_COPY.writing,
      text: HOME_NOW_COPY.books(bookCount),
      href: BOOKS_PATH,
    });
  }

  if (latestPost) {
    items.push({
      id: 'latest-post',
      icon: 'fa-solid fa-pen-nib',
      lead: HOME_NOW_COPY.latestPost,
      text: latestPost.title,
      href: latestPost.href,
    });
  }

  return items;
}
