import type { ContentCategory } from './types';
import { getUrlHostname } from './utils';

export const WISHLIST_PATH = '/wishlist';
export const WISHLIST_DEFAULT_ICON = 'fa-solid fa-list-ul';
export const WISHLIST_ALL_CATEGORY_ID = 'all';
export const WISHLIST_GOT_STATUS = 'got';
export const WISHLIST_WANTING_STATUS = 'wanting';
export const WISHLIST_CANCELED_STATUS = 'canceled';
export const WISHLIST_DROPPED_STATUS = 'dropped';

export const WISHLIST_PAGE_COPY = {
  title: 'Wishlist',
  subtitle: 'The next upgrades for a very unusual home office',
  allDescription: 'Everything I still want, already received, or let go.',
  empty: 'Nothing here yet. I’ll add items as the wants become clear.',
  subjectIndexLabel: 'Wishlist subjects',
  gotLabel: 'Got it',
  completedTitle: 'Completed',
  completedDescription: 'Things that used to live on this list.',
  canceledTitle: 'Canceled',
  canceledDescription: 'Ideas Alfred successfully talked me out of.',
  canceledLabel: 'Canceled',
  searchDescription:
    'Bruce Wayne’s fictional Batcave wishlist, from quieter gadgets to better coffee.',
} as const;

export type WishlistStatus =
  | typeof WISHLIST_WANTING_STATUS
  | typeof WISHLIST_GOT_STATUS
  | typeof WISHLIST_CANCELED_STATUS
  | typeof WISHLIST_DROPPED_STATUS;

export interface WishlistItem {
  id: string;
  title: string;
  why: string;
  url?: string;
  priceNote?: string;
  status: WishlistStatus;
}

export interface WishlistEntry extends WishlistItem {
  category: string;
  categoryId: string;
}

export interface WishlistShelf {
  id: string;
  label: string;
  description: string;
  icon: string;
  entries: WishlistEntry[];
}

interface WishlistGroup {
  id: string;
  label: string;
  description: string;
  icon: string;
  items: WishlistItem[];
}

const WISHLIST_GROUPS: WishlistGroup[] = [
  {
    id: 'hardware',
    label: 'Hardware',
    description: 'The cave’s next round of upgrades.',
    icon: 'fa-solid fa-keyboard',
    items: [
      {
        id: 'silent-grapnel',
        title: 'A Quieter Grapnel',
        why: 'The current model announces every arrival three rooftops early.',
        url: 'https://example.org/wayne/grapnel',
        priceNote: 'Budget: ask Lucius',
        status: WISHLIST_WANTING_STATUS,
      },
      {
        id: 'batcomputer-display',
        title: 'Batcomputer Ultrawide',
        why: 'Finally enough screen space for the map and Alfred’s dinner reminders.',
        status: WISHLIST_GOT_STATUS,
      },
    ],
  },
  {
    id: 'home-office',
    label: 'Home Office',
    description: 'Comfort is a feature, even in a cave.',
    icon: 'fa-solid fa-chair',
    items: [
      {
        id: 'cave-coffee',
        title: 'A Cave-Proof Espresso Machine',
        why: 'One that keeps working through humidity, power tests, and unexpected bats.',
        status: WISHLIST_WANTING_STATUS,
      },
      {
        id: 'revolving-chair',
        title: 'Dramatic Revolving Chair',
        why: 'Alfred pointed out that every chair already revolves if I stop buying capes.',
        status: WISHLIST_CANCELED_STATUS,
      },
      {
        id: 'private-prototype',
        title: 'Indoor Batmobile Ramp',
        why: 'A private prototype. The manor’s floorboards have declined to comment.',
        status: WISHLIST_DROPPED_STATUS,
      },
    ],
  },
];

function isPublicWishlistItem(item: WishlistItem): boolean {
  return item.status !== WISHLIST_DROPPED_STATUS;
}

function toWishlistEntry(
  item: WishlistItem,
  group: WishlistGroup,
): WishlistEntry {
  return {
    ...item,
    category: group.label,
    categoryId: group.id,
  };
}

function buildWishlistShelves(groups: WishlistGroup[]): WishlistShelf[] {
  const seenItemIds = new Set<string>();
  const seenGroupIds = new Set<string>();

  return groups.map((group) => {
    if (group.id === WISHLIST_ALL_CATEGORY_ID) {
      throw new Error(`Wishlist group id is reserved: ${group.id}`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate wishlist group id: ${group.id}`);
    }
    seenGroupIds.add(group.id);

    group.items.forEach((item) => {
      if (seenItemIds.has(item.id)) {
        throw new Error(`Duplicate wishlist item id: ${item.id}`);
      }
      seenItemIds.add(item.id);
    });

    return {
      id: group.id,
      label: group.label,
      description: group.description,
      icon: group.icon,
      entries: group.items
        .filter(isPublicWishlistItem)
        .map((item) => toWishlistEntry(item, group)),
    };
  });
}

export const WISHLIST_SHELVES = buildWishlistShelves(WISHLIST_GROUPS);

export const WISHLIST: WishlistEntry[] = WISHLIST_SHELVES.flatMap(
  (shelf) => shelf.entries,
);

export const ACTIVE_WISHLIST_SHELVES = WISHLIST_SHELVES.filter(
  (shelf) => shelf.entries.length > 0,
);

export const ACTIVE_WISHLIST_CATEGORIES: ContentCategory[] =
  ACTIVE_WISHLIST_SHELVES.map(({ id, label, description, icon }) => ({
    id,
    label,
    description,
    icon,
  }));

export const WISHLIST_ALL_CATEGORY: ContentCategory = {
  id: WISHLIST_ALL_CATEGORY_ID,
  label: 'All',
  description: WISHLIST_PAGE_COPY.allDescription,
  icon: WISHLIST_DEFAULT_ICON,
};

export const WISHLIST_ALL_SHELF: WishlistShelf = {
  id: WISHLIST_ALL_CATEGORY.id,
  label: WISHLIST_ALL_CATEGORY.label,
  description: WISHLIST_ALL_CATEGORY.description,
  icon: WISHLIST_DEFAULT_ICON,
  entries: WISHLIST,
};

export const WISHLIST_NAV_SHELVES: WishlistShelf[] = [
  WISHLIST_ALL_SHELF,
  ...ACTIVE_WISHLIST_SHELVES,
];

export function getWishlistCategoryPath(
  category: Pick<ContentCategory, 'id'>,
): string {
  return category.id === WISHLIST_ALL_CATEGORY_ID
    ? WISHLIST_PATH
    : `${WISHLIST_PATH}/${category.id}`;
}

export function getWishlistItemPath(item: Pick<WishlistEntry, 'id'>): string {
  return `${WISHLIST_PATH}#${item.id}`;
}

export function getWishlistShelf(
  categoryId: string,
): WishlistShelf | undefined {
  return WISHLIST_NAV_SHELVES.find((shelf) => shelf.id === categoryId);
}

export function getWishlistSourceLabel(url: string): string {
  return getUrlHostname(url);
}

export function isWishlistItemGot(item: Pick<WishlistItem, 'status'>): boolean {
  return item.status === WISHLIST_GOT_STATUS;
}

export function isWishlistItemCanceled(
  item: Pick<WishlistItem, 'status'>,
): boolean {
  return item.status === WISHLIST_CANCELED_STATUS;
}

export function splitWishlistEntries(entries: WishlistEntry[]): {
  wanting: WishlistEntry[];
  got: WishlistEntry[];
  canceled: WishlistEntry[];
} {
  return {
    wanting: entries.filter(
      (entry) => entry.status === WISHLIST_WANTING_STATUS,
    ),
    got: entries.filter((entry) => isWishlistItemGot(entry)),
    canceled: entries.filter((entry) => isWishlistItemCanceled(entry)),
  };
}
