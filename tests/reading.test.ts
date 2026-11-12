import { describe, expect, test } from 'bun:test';
import { isReservedArticleSlug } from '../apps/web/src/lib/articleRoutes';
import { SITE_NAV_ITEMS } from '../apps/web/src/lib/navigation';
import {
  ACTIVE_READING_CATEGORIES,
  getReadingCategoryPath,
  READING,
  READING_PATH,
} from '../apps/web/src/lib/reading';
import { RATING_ALL_CATEGORY_ID } from '../apps/web/src/lib/ratings';
import { SHELF_PATH } from '../apps/web/src/lib/shelf';

describe('reading list', () => {
  test('reserves the reading route and reaches it from Shelf', () => {
    expect(READING_PATH).toBe('/reading');
    expect(isReservedArticleSlug('reading')).toBe(true);
    expect(isReservedArticleSlug('books')).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === SHELF_PATH)).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === READING_PATH)).toBe(
      false,
    );
    expect(SITE_NAV_ITEMS.some((item) => item.href === '/books')).toBe(true);
  });

  test('keeps sample books, empty genre rails, and their paths', () => {
    expect(getReadingCategoryPath({ id: RATING_ALL_CATEGORY_ID })).toBe(
      READING_PATH,
    );
    expect(getReadingCategoryPath({ id: 'fantasy' })).toBe(
      `${READING_PATH}/fantasy`,
    );
    expect(READING.some((book) => book.status === 'watched')).toBe(true);
    expect(READING.some((book) => book.status === 'queued')).toBe(true);
    expect(ACTIVE_READING_CATEGORIES.map((category) => category.id)).toEqual([
      'fiction',
      'nonfiction',
      'fantasy',
      'history',
      'design',
    ]);
  });
});
