import { describe, expect, test } from 'bun:test';
import { isReservedArticleSlug } from '../apps/web/src/lib/articleRoutes';
import { SITE_NAV_ITEMS } from '../apps/web/src/lib/navigation';
import { SHELF_PATH } from '../apps/web/src/lib/shelf';
import {
  ACTIVE_WISHLIST_CATEGORIES,
  getWishlistCategoryPath,
  getWishlistItemPath,
  getWishlistShelf,
  getWishlistSourceLabel,
  isWishlistItemCanceled,
  isWishlistItemGot,
  splitWishlistEntries,
  WISHLIST,
  WISHLIST_CANCELED_STATUS,
  WISHLIST_ALL_CATEGORY_ID,
  WISHLIST_GOT_STATUS,
  WISHLIST_PATH,
  WISHLIST_WANTING_STATUS,
} from '../apps/web/src/lib/wishlist';

describe('wishlist resources', () => {
  test('reserves the wishlist route and reaches it from Shelf navigation', () => {
    expect(WISHLIST_PATH).toBe('/wishlist');
    expect(isReservedArticleSlug('wishlist')).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === SHELF_PATH)).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === WISHLIST_PATH)).toBe(
      false,
    );
  });

  test('builds all and subject paths without hashes', () => {
    expect(getWishlistCategoryPath({ id: WISHLIST_ALL_CATEGORY_ID })).toBe(
      WISHLIST_PATH,
    );
    expect(getWishlistCategoryPath({ id: 'hardware' })).toBe(
      `${WISHLIST_PATH}/hardware`,
    );
    expect(getWishlistItemPath({ id: 'example-item' })).toBe(
      `${WISHLIST_PATH}#example-item`,
    );
  });

  test('publishes wanting and got items and hides dropped ones', () => {
    expect(WISHLIST.some((item) => item.id === 'silent-grapnel')).toBe(true);
    expect(WISHLIST.some((item) => item.id === 'cave-coffee')).toBe(true);
    expect(WISHLIST.find((item) => item.id === 'silent-grapnel')?.status).toBe(
      WISHLIST_WANTING_STATUS,
    );
    expect(
      WISHLIST.find((item) => item.id === 'batcomputer-display')?.status,
    ).toBe(WISHLIST_GOT_STATUS);
    expect(ACTIVE_WISHLIST_CATEGORIES.map((category) => category.id)).toEqual([
      'hardware',
      'home-office',
    ]);
    expect(
      getWishlistShelf(WISHLIST_ALL_CATEGORY_ID)?.entries.length,
    ).toBeGreaterThan(0);
    expect(getWishlistShelf('hardware')?.entries.length).toBeGreaterThan(0);
    expect(WISHLIST.some((item) => item.id === 'private-prototype')).toBe(
      false,
    );
    const split = splitWishlistEntries(WISHLIST);
    expect(
      split.wanting.every((item) => item.status === WISHLIST_WANTING_STATUS),
    ).toBe(true);
    expect(split.got.every((item) => item.status === WISHLIST_GOT_STATUS)).toBe(
      true,
    );
    expect(
      split.canceled.every((item) => item.status === WISHLIST_CANCELED_STATUS),
    ).toBe(true);
    expect(split.wanting.length).toBeGreaterThan(0);
    expect(split.got.length).toBeGreaterThan(0);
    expect(split.canceled.map((item) => item.id)).toEqual(['revolving-chair']);
  });

  test('treats got items as received and reads source hostnames', () => {
    expect(isWishlistItemGot({ status: WISHLIST_GOT_STATUS })).toBe(true);
    expect(isWishlistItemGot({ status: WISHLIST_WANTING_STATUS })).toBe(false);
    expect(isWishlistItemCanceled({ status: WISHLIST_CANCELED_STATUS })).toBe(
      true,
    );
    expect(getWishlistSourceLabel('https://www.example.com/item')).toBe(
      'example.com',
    );
  });
});
