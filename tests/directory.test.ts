import { describe, expect, test } from 'bun:test';
import {
  ACTIVE_DIRECTORY_SHELVES,
  DIRECTORY,
  DIRECTORY_ALL_CATEGORY_ID,
  DIRECTORY_PATH,
  getDirectoryCategoryPath,
  getDirectoryShelf,
} from '../apps/web/src/lib/directory';
import { SITE_NAV_ITEMS } from '../apps/web/src/lib/navigation';
import { SHELF_PATH } from '../apps/web/src/lib/shelf';

describe('bookmark shelves', () => {
  test('keeps every public shelf populated', () => {
    expect(ACTIVE_DIRECTORY_SHELVES.length).toBeGreaterThan(0);
    expect(
      ACTIVE_DIRECTORY_SHELVES.every((shelf) => shelf.entries.length > 0),
    ).toBe(true);
  });

  test('flattens shelf entries into the public bookmarks list', () => {
    const shelfCount = ACTIVE_DIRECTORY_SHELVES.reduce(
      (total, shelf) => total + shelf.entries.length,
      0,
    );

    expect(DIRECTORY.length).toBe(shelfCount);
  });

  test('builds real category paths without hashes', () => {
    expect(getDirectoryCategoryPath({ id: DIRECTORY_ALL_CATEGORY_ID })).toBe(
      DIRECTORY_PATH,
    );
    expect(DIRECTORY_PATH).toBe('/bookmarks');
    expect(SITE_NAV_ITEMS.some((item) => item.href === SHELF_PATH)).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === DIRECTORY_PATH)).toBe(
      false,
    );
    expect(getDirectoryCategoryPath({ id: 'public-apis' })).toBe(
      `${DIRECTORY_PATH}/public-apis`,
    );
    expect(getDirectoryShelf('public-apis')?.entries.length).toBeGreaterThan(0);
    expect(getDirectoryShelf(DIRECTORY_ALL_CATEGORY_ID)?.entries).toEqual(
      DIRECTORY,
    );
  });
});
