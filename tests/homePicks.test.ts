import { describe, expect, test } from 'bun:test';
import * as home from '../apps/web/src/lib/home';

describe('homepage picks', () => {
  test('lists every featured post in newest-first order', () => {
    expect('getAllFeaturedPosts' in home).toBe(true);
    if (!('getAllFeaturedPosts' in home)) return;

    const posts = [
      {
        data: {
          slug: 'featured-oldest',
          featured: true,
          pubDate: new Date('2026-01-01'),
        },
      },
      {
        data: {
          slug: 'not-featured',
          featured: false,
          pubDate: new Date('2026-10-01'),
        },
      },
      ...['02', '03', '04', '05', '06', '07', '08', '09'].map((month) => ({
        data: {
          slug: `featured-${month}`,
          featured: true,
          pubDate: new Date(`2026-${month}-01`),
        },
      })),
    ];

    expect(
      home.getAllFeaturedPosts(posts).map((post) => post.data.slug),
    ).toEqual([
      'featured-09',
      'featured-08',
      'featured-07',
      'featured-06',
      'featured-05',
      'featured-04',
      'featured-03',
      'featured-02',
      'featured-oldest',
    ]);
  });

  test('shows the seven newest featured posts', () => {
    expect('getHomePicks' in home).toBe(true);
    if (!('getHomePicks' in home)) return;

    const posts = [
      {
        data: {
          slug: 'featured-oldest',
          featured: true,
          pubDate: new Date('2026-01-01'),
        },
      },
      {
        data: {
          slug: 'not-featured',
          featured: false,
          pubDate: new Date('2026-07-01'),
        },
      },
      ...['02', '03', '04', '05', '06', '07', '08'].map((month) => ({
        data: {
          slug: `featured-${month}`,
          featured: true,
          pubDate: new Date(`2026-${month}-01`),
        },
      })),
    ];

    expect(home.getHomePicks(posts).map((post) => post.data.slug)).toEqual([
      'featured-08',
      'featured-07',
      'featured-06',
      'featured-05',
      'featured-04',
      'featured-03',
      'featured-02',
    ]);
  });
});
