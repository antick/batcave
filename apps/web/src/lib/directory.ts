import type { ContentCategory, DirectoryEntry } from './types';
import { getUrlHostname } from './utils';

export const BOOKMARKS_PATH = '/bookmarks';
export const DIRECTORY_PATH = BOOKMARKS_PATH;
export const DIRECTORY_DEFAULT_ICON = 'fa-solid fa-table-list';
export const DIRECTORY_ALL_CATEGORY_ID = 'all';
export const DIRECTORY_PAGE_COPY = {
  title: 'Bookmarks',
  subtitle: 'The Gotham references I keep one grapnel away.',
  allDescription: 'Every destination in one place.',
  subjectIndexLabel: 'Bookmark subjects',
  searchDescription:
    'Bruce Wayne’s fictional bookmarks for Gotham research, gadgets, and civic projects.',
};

export function getBookmarkCountLabel(count: number): string {
  return count === 1 ? '1 destination' : `${count} destinations`;
}

export interface DirectoryShelf {
  id: string;
  label: string;
  description: string;
  icon: string;
  entries: DirectoryEntry[];
}

interface DirectoryGroup {
  id: string;
  label: string;
  description: string;
  icon: string;
  links: Array<Pick<DirectoryEntry, 'title' | 'url'>>;
}

const DIRECTORY_GROUPS: DirectoryGroup[] = [
  {
    id: 'gotham',
    label: 'Gotham',
    description: 'City references for a long night out.',
    icon: 'fa-solid fa-city',
    links: [
      {
        title: 'Gotham Rooftop Atlas',
        url: 'https://example.org/gotham/rooftops',
      },
      {
        title: 'Wayne Foundation Project Board',
        url: 'https://example.org/gotham/foundation',
      },
      {
        title: 'Gotham Public Library Archive',
        url: 'https://example.org/gotham/library',
      },
    ],
  },
  {
    id: 'public-apis',
    label: 'Public APIs',
    description: 'Imaginary data feeds for the Batcomputer.',
    icon: 'fa-solid fa-code',
    links: [
      {
        title: 'Gotham Weather Feed',
        url: 'https://example.org/gotham/weather',
      },
      {
        title: 'Gotham Transit Status',
        url: 'https://example.org/gotham/transit',
      },
    ],
  },
  {
    id: 'workshop',
    label: 'Workshop',
    description: 'Things Lucius asked me to read first.',
    icon: 'fa-solid fa-screwdriver-wrench',
    links: [
      {
        title: 'Wayne R&D Design Notebook',
        url: 'https://example.org/wayne/design',
      },
      {
        title: 'Batmobile Maintenance Manual',
        url: 'https://example.org/wayne/batmobile',
      },
    ],
  },
];

export const DIRECTORY_SHELVES: DirectoryShelf[] = DIRECTORY_GROUPS.map(
  (group) => ({
    id: group.id,
    label: group.label,
    description: group.description,
    icon: group.icon,
    entries: group.links.map((entry) => ({
      ...entry,
      category: group.label,
    })),
  }),
);

export const DIRECTORY: DirectoryEntry[] = DIRECTORY_SHELVES.flatMap(
  (shelf) => shelf.entries,
);

export const DIRECTORY_CATEGORIES: ContentCategory[] = DIRECTORY_SHELVES.map(
  ({ id, label, description, icon }) => ({ id, label, description, icon }),
);

export const DIRECTORY_CATEGORY_ICONS: Record<string, string> =
  Object.fromEntries(DIRECTORY_SHELVES.map(({ label, icon }) => [label, icon]));

export const ACTIVE_DIRECTORY_SHELVES = DIRECTORY_SHELVES.filter(
  (shelf) => shelf.entries.length > 0,
);

export const ACTIVE_DIRECTORY_CATEGORIES = ACTIVE_DIRECTORY_SHELVES.map(
  ({ id, label, description, icon }) => ({ id, label, description, icon }),
);

export const DIRECTORY_ALL_CATEGORY: ContentCategory = {
  id: DIRECTORY_ALL_CATEGORY_ID,
  label: 'All',
  description: DIRECTORY_PAGE_COPY.allDescription,
  icon: DIRECTORY_DEFAULT_ICON,
};

export const DIRECTORY_ALL_SHELF: DirectoryShelf = {
  id: DIRECTORY_ALL_CATEGORY.id,
  label: DIRECTORY_ALL_CATEGORY.label,
  description: DIRECTORY_ALL_CATEGORY.description,
  icon: DIRECTORY_DEFAULT_ICON,
  entries: DIRECTORY,
};

export const DIRECTORY_NAV_SHELVES: DirectoryShelf[] = [
  DIRECTORY_ALL_SHELF,
  ...ACTIVE_DIRECTORY_SHELVES,
];

export function getDirectoryCategoryPath(
  category: Pick<ContentCategory, 'id'>,
): string {
  return category.id === DIRECTORY_ALL_CATEGORY_ID
    ? DIRECTORY_PATH
    : `${DIRECTORY_PATH}/${category.id}`;
}

export function getDirectoryShelf(
  categoryId: string,
): DirectoryShelf | undefined {
  return DIRECTORY_NAV_SHELVES.find((shelf) => shelf.id === categoryId);
}

export function getDirectoryHostname(url: string): string {
  return getUrlHostname(url);
}

export function getDirectoryIcon(category: string): string {
  return DIRECTORY_CATEGORY_ICONS[category] ?? DIRECTORY_DEFAULT_ICON;
}
