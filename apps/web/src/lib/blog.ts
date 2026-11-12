import { isReservedBlogCategoryId } from './articleRoutes';
import {
  BLOG_ALL_CATEGORY,
  BLOG_CATEGORY_FALLBACK_ICON,
  POST_CATEGORIES,
} from './constants';
import { filterPostsByBlogCategory } from './content';
import type { ContentCategory } from './types';
import { toCategoryId } from './utils';

export interface BlogCategorySummary {
  category: ContentCategory;
  count: number;
}

export const HOME_TOPICS_COPY = {
  label: '// browse by topic',
  action: 'Browse all posts',
} as const;

export function getBlogCategories(
  posts: { data: { category: string } }[],
): ContentCategory[] {
  const configuredCategories = new Map(
    POST_CATEGORIES.map((category) => [category.id, category]),
  );
  const discoveredCategories = new Map<string, string>();

  posts.forEach((post) => {
    const label = post.data.category.trim();
    const id = toCategoryId(label);
    if (isReservedBlogCategoryId(id)) {
      throw new Error(
        `Article category "${label}" conflicts with a reserved blog listing route.`,
      );
    }
    discoveredCategories.set(id, label);
  });

  return [...discoveredCategories.entries()]
    .map(
      ([id, label]) =>
        configuredCategories.get(id) ?? {
          id,
          label,
          description: `Posts about ${label}.`,
          icon: BLOG_CATEGORY_FALLBACK_ICON,
        },
    )
    .sort((first, second) => first.label.localeCompare(second.label));
}

export function getBlogListingCategories(
  categories: ContentCategory[],
): ContentCategory[] {
  return [BLOG_ALL_CATEGORY, ...categories];
}

export function getBlogCategorySummaries(
  posts: { data: { category: string } }[],
  categories: ContentCategory[],
): BlogCategorySummary[] {
  return getBlogListingCategories(categories).map((category) => {
    const categoryPosts = filterPostsByBlogCategory(posts, category.id);
    return {
      category,
      count: categoryPosts.length,
    };
  });
}
