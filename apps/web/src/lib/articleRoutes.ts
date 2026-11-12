export const BLOG_INDEX_PATH = '/blog';
export const FEATURED_WRITING_PATH = '/featured';
export const BLOG_ALL_CATEGORY_ID = 'all';
export const BLOG_PAGINATION_SEGMENT = 'page';

export const RESERVED_ARTICLE_SLUGS = [
  '404',
  'about',
  'blog',
  'bookmarks',
  'books',
  'contact',
  'directory',
  'featured',
  'listen',
  'movies',
  'music',
  'projects',
  'reading',
  'rss.xml',
  'search',
  'shelf',
  'sitemap.xml',
  'tags',
  'tv-shows',
  'watch',
  'wishlist',
] as const;

export const RESERVED_BLOG_CATEGORY_IDS = [
  BLOG_ALL_CATEGORY_ID,
  BLOG_PAGINATION_SEGMENT,
] as const;

const reservedArticleSlugs = new Set<string>(RESERVED_ARTICLE_SLUGS);
const reservedBlogCategoryIds = new Set<string>(RESERVED_BLOG_CATEGORY_IDS);

export function getArticlePath(article: { slug: string }) {
  return `/${article.slug}`;
}

export function getBlogCategoryPath(category: { id: string }) {
  return `${BLOG_INDEX_PATH}/${category.id}`;
}

export function getBlogAllPath() {
  return getBlogCategoryPath({ id: BLOG_ALL_CATEGORY_ID });
}

export function isReservedArticleSlug(slug: string) {
  return reservedArticleSlugs.has(slug);
}

export function isReservedBlogCategoryId(id: string) {
  return reservedBlogCategoryIds.has(id);
}
