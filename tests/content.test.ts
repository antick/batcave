import { describe, expect, test } from 'bun:test';
import {
  BLOG_INDEX_PATH,
  FEATURED_WRITING_PATH,
  getBlogAllPath,
  getBlogCategoryPath,
  isReservedArticleSlug,
  isReservedBlogCategoryId,
} from '../apps/web/src/lib/articleRoutes';
import {
  getBlogCategories,
  getBlogCategorySummaries,
  getBlogListingCategories,
} from '../apps/web/src/lib/blog';
import { BLOG_ALL_CATEGORY } from '../apps/web/src/lib/constants';
import {
  filterPostsByBlogCategory,
  shouldRenderArticleTableOfContents,
  shouldShowArticleFeaturedImage,
  shouldShowArticleHeaderMeta,
  shouldShowArticleRelatedPosts,
  sortContentByPriority,
} from '../apps/web/src/lib/content';
import { buildHomeSitePulse, getRecentWriting } from '../apps/web/src/lib/home';
import { buildHomeNow } from '../apps/web/src/lib/homeNow';
import { SITE_NAV_ITEMS } from '../apps/web/src/lib/navigation';

function entry(slug: string, pubDate: string, featured = false) {
  return {
    data: {
      slug,
      featured,
      pubDate: new Date(pubDate),
    },
  };
}

describe('sortContentByPriority', () => {
  test('keeps featured content first, then newest dates', () => {
    const result = sortContentByPriority([
      entry('older', '2026-06-01'),
      entry('featured', '2026-05-01', true),
      entry('newer', '2026-07-01'),
    ]);

    expect(result.map((item) => item.data.slug)).toEqual([
      'featured',
      'newer',
      'older',
    ]);
  });

  test('uses the slug as a deterministic date tie breaker', () => {
    const result = sortContentByPriority([
      entry('zeta', '2026-07-01'),
      entry('alpha', '2026-07-01'),
    ]);

    expect(result.map((item) => item.data.slug)).toEqual(['alpha', 'zeta']);
  });
});

describe('article table of contents', () => {
  const headings = [
    { depth: 2, slug: 'one', text: 'One' },
    { depth: 3, slug: 'nested', text: 'Nested' },
  ];

  test('shows the index for posts with section headings', () => {
    expect(shouldRenderArticleTableOfContents(headings, false)).toBe(true);
  });

  test('hides the index on prompt posts even when headings exist', () => {
    expect(shouldRenderArticleTableOfContents(headings, true)).toBe(false);
  });

  test('hides the index when a post has no section headings', () => {
    expect(
      shouldRenderArticleTableOfContents(
        [{ depth: 3, slug: 'nested', text: 'Nested' }],
        false,
      ),
    ).toBe(false);
  });
});

describe('list article presentation', () => {
  test('hides featured image and related posts on list articles by default', () => {
    expect(shouldShowArticleFeaturedImage({ list: {} })).toBe(false);
    expect(shouldShowArticleRelatedPosts({ list: {} })).toBe(false);
  });

  test('keeps featured image and related posts on non-list articles', () => {
    expect(shouldShowArticleFeaturedImage({})).toBe(true);
    expect(shouldShowArticleRelatedPosts({})).toBe(true);
  });

  test('honors explicit list presentation flags', () => {
    expect(
      shouldShowArticleFeaturedImage({ list: { showFeaturedImage: true } }),
    ).toBe(true);
    expect(
      shouldShowArticleRelatedPosts({ list: { showRelatedPosts: true } }),
    ).toBe(true);
  });

  test('hides header meta on list articles and keeps it on other posts', () => {
    expect(shouldShowArticleHeaderMeta({ list: {} })).toBe(false);
    expect(shouldShowArticleHeaderMeta({})).toBe(true);
  });
});

describe('blog routes', () => {
  test('uses /blog for listings and reserves it from post slugs', () => {
    expect(BLOG_INDEX_PATH).toBe('/blog');
    expect(FEATURED_WRITING_PATH).toBe('/featured');
    expect(getBlogAllPath()).toBe('/blog/all');
    expect(getBlogCategoryPath({ id: 'gaming' })).toBe('/blog/gaming');
    expect(isReservedArticleSlug('blog')).toBe(true);
    expect(isReservedArticleSlug('featured')).toBe(true);
    expect(isReservedArticleSlug('tags')).toBe(true);
    expect(isReservedArticleSlug('directory')).toBe(true);
    expect(isReservedArticleSlug('bookmarks')).toBe(true);
    expect(isReservedArticleSlug('wishlist')).toBe(true);
    expect(isReservedArticleSlug('watch')).toBe(true);
    expect(isReservedArticleSlug('listen')).toBe(true);
    expect(isReservedArticleSlug('music')).toBe(true);
    expect(isReservedArticleSlug('reading')).toBe(true);
    expect(isReservedArticleSlug('shelf')).toBe(true);
    expect(isReservedArticleSlug('movies')).toBe(true);
    expect(isReservedArticleSlug('tv-shows')).toBe(true);
    expect(isReservedArticleSlug('articles')).toBe(false);
    expect(isReservedBlogCategoryId('all')).toBe(true);
    expect(isReservedBlogCategoryId('page')).toBe(true);
    expect(isReservedBlogCategoryId('engineering')).toBe(false);
  });

  test('links Blog navigation directly to the Posts hub', () => {
    const blogNav = SITE_NAV_ITEMS.find((item) => item.id === 'blog');
    expect(blogNav?.href).toBe(BLOG_INDEX_PATH);
  });
});

describe('blog category listings', () => {
  const posts = [
    {
      data: {
        title: 'Engineering one',
        category: 'Engineering',
        draft: false,
      },
    },
    {
      data: {
        title: 'Prompt one',
        category: 'Prompts',
        draft: false,
      },
    },
  ];

  test('discovers active categories and prepends All for the Posts hub', () => {
    const categories = getBlogCategories(posts);
    expect(categories.map((category) => category.id)).toEqual([
      'engineering',
      'prompts',
    ]);
    expect(
      getBlogListingCategories(categories).map((category) => category.id),
    ).toEqual(['all', 'engineering', 'prompts']);
  });

  test('filters all posts for the All category and one category otherwise', () => {
    expect(filterPostsByBlogCategory(posts, 'all')).toHaveLength(2);
    expect(
      filterPostsByBlogCategory(posts, 'engineering').map(
        (post) => post.data.title,
      ),
    ).toEqual(['Engineering one']);
  });

  test('builds hub cards with counts, including All first', () => {
    const summaries = getBlogCategorySummaries(posts, getBlogCategories(posts));

    expect(summaries[0]).toMatchObject({
      category: BLOG_ALL_CATEGORY,
      count: 2,
    });
    expect(summaries.map((summary) => summary.category.label)).toEqual([
      'All',
      'Engineering',
      'Prompts',
    ]);
  });

  test('rejects a reserved All category on a post', () => {
    expect(() => getBlogCategories([{ data: { category: 'All' } }])).toThrow(
      'reserved blog listing route',
    );
  });
});

describe('homepage site pulse', () => {
  test('derives publishing insights and recent activity from site data', () => {
    const posts = [
      {
        id: 'gaming-one',
        data: {
          title: 'Gaming one',
          slug: 'gaming-one',
          category: 'Gaming',
          tags: ['games'],
          pubDate: new Date('2026-01-15T00:00:00Z'),
          draft: false,
        },
      },
      {
        id: 'gaming-two',
        data: {
          title: 'Gaming two',
          slug: 'gaming-two',
          category: 'Gaming',
          tags: ['games', 'reviews'],
          pubDate: new Date('2026-07-05T00:00:00Z'),
          draft: false,
        },
      },
      {
        id: 'tools-one',
        data: {
          title: 'Tools one',
          slug: 'tools-one',
          category: 'Tools',
          tags: ['tools'],
          pubDate: new Date('2026-07-20T00:00:00Z'),
          draft: false,
        },
      },
    ];
    const pulse = buildHomeSitePulse({
      posts: posts as never,
      categories: [
        { id: 'gaming', label: 'Gaming', description: 'Games.' },
        { id: 'tools', label: 'Tools', description: 'Tools.' },
      ],
      projectCount: 4,
      openSourceCount: 3,
      shelfItemCount: 63,
      referenceDate: new Date(2026, 7, 1),
    });

    expect(pulse.publishing).toHaveLength(12);
    expect(
      pulse.publishing.find((month) => month.id === '2026-07'),
    ).toMatchObject({
      count: 2,
      height: 100,
    });
    expect(pulse.publishingInsights).toEqual({
      postCount: 3,
      activeMonthCount: 2,
      busiestMonthLabel: 'Jul 2026',
      busiestMonthCount: 2,
    });
    const recent = getRecentWriting(posts as never);
    expect(recent.map((item) => item.title)).toEqual([
      'Tools one',
      'Gaming two',
      'Gaming one',
    ]);
    expect(recent.map((item) => item.category)).toEqual([
      'Tools',
      'Gaming',
      'Gaming',
    ]);
    expect(pulse.stats.map((stat) => stat.label)).toEqual([
      'Posts',
      'Categories',
      'Tags',
      'Projects',
      'Open source',
      'Shelf items',
    ]);
    expect(
      pulse.stats.find((stat) => stat.label === 'Shelf items'),
    ).toMatchObject({ value: 63, href: '/shelf' });
    expect(
      pulse.stats.find((stat) => stat.label === 'Open source')?.external,
    ).toBe(true);
    expect(pulse.stats.find((stat) => stat.label === 'Tags')).toMatchObject({
      value: 3,
      href: '/tags',
    });
  });
});

describe('homepage now card', () => {
  test('derives items from the spotlight project, books, and latest post', () => {
    const items = buildHomeNow({
      spotlight: {
        slug: 'tool',
        title: 'Tool',
        description: 'A tool.',
        href: 'https://example.com/repositories/tool',
        externalLink: {
          href: 'https://tool.example',
          label: 'Visit website',
          icon: 'fa-solid fa-globe',
        },
        icon: 'fa-solid fa-code',
        kind: 'CLI',
        tags: [],
        featured: true,
        spotlight: true,
      },
      bookCount: 2,
      latestPost: {
        id: 'post-one',
        title: 'Post one',
        category: 'Tools',
        date: new Date('2026-07-20T00:00:00Z'),
        href: '/post-one',
      },
    });

    expect(items.map((item) => item.id)).toEqual([
      'building',
      'writing',
      'latest-post',
    ]);
    expect(items[0]).toMatchObject({
      text: 'Tool',
      href: 'https://tool.example',
      external: true,
    });
    expect(items[2]).toMatchObject({ text: 'Post one', href: '/post-one' });
  });

  test('skips items without data', () => {
    expect(buildHomeNow({ bookCount: 0 })).toEqual([]);
  });
});
