import { describe, expect, test } from 'bun:test';
import { isReservedArticleSlug } from '../apps/web/src/lib/articleRoutes';
import {
  getMovieCategoryPath,
  MOVIES,
  MOVIES_PATH,
} from '../apps/web/src/lib/movies';
import {
  getRatingScoreLabel,
  RATING_ALL_CATEGORY_ID,
  RATING_MAX,
  RATING_UNRATED_MARK,
} from '../apps/web/src/lib/ratings';
import { SITE_NAV_ITEMS } from '../apps/web/src/lib/navigation';
import { SHELF_PATH } from '../apps/web/src/lib/shelf';
import {
  getTvShowCategoryPath,
  TV_SHOWS,
  TV_SHOWS_PATH,
} from '../apps/web/src/lib/tvShows';

describe('movie and TV ratings', () => {
  test('reserves shelf rating routes and keeps them off the top nav', () => {
    expect(MOVIES_PATH).toBe('/movies');
    expect(TV_SHOWS_PATH).toBe('/tv-shows');
    expect(isReservedArticleSlug('movies')).toBe(true);
    expect(isReservedArticleSlug('tv-shows')).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === SHELF_PATH)).toBe(true);
    expect(SITE_NAV_ITEMS.some((item) => item.href === MOVIES_PATH)).toBe(
      false,
    );
    expect(SITE_NAV_ITEMS.some((item) => item.href === TV_SHOWS_PATH)).toBe(
      false,
    );
  });

  test('builds genre paths and keeps ratings structured', () => {
    expect(getMovieCategoryPath({ id: RATING_ALL_CATEGORY_ID })).toBe(
      MOVIES_PATH,
    );
    expect(getMovieCategoryPath({ id: 'action' })).toBe(
      `${MOVIES_PATH}/action`,
    );
    expect(getTvShowCategoryPath({ id: 'horror' })).toBe(
      `${TV_SHOWS_PATH}/horror`,
    );
    expect(MOVIES.length).toBeGreaterThan(0);
    expect(TV_SHOWS.length).toBeGreaterThan(0);
    expect(
      MOVIES.filter((movie) => movie.rating != null).every(
        (movie) =>
          movie.rating != null && movie.rating >= 1 && movie.rating <= 5,
      ),
    ).toBe(true);
    expect(getRatingScoreLabel(5)).toBe(`5/${RATING_MAX}`);
    expect(getRatingScoreLabel()).toBe(`${RATING_UNRATED_MARK}/${RATING_MAX}`);
  });
});
