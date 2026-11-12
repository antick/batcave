export const LIST_FILTER_ALL_ID = 'all';
export const LIST_ARTICLE_COPY = {
  filterLabel: 'List categories',
  allLabel: 'All',
  showingAll: 'Showing all {count} items',
  showingFiltered: 'Showing {count} filtered items',
} as const;

export interface ListArticleItem {
  title: string;
  description?: string;
  meta?: string;
  group?: string;
}

export interface ListArticleData {
  layout?: 'detailed' | 'compact';
  showFeaturedImage?: boolean;
  showRelatedPosts?: boolean;
  items: ListArticleItem[];
}

export function getListItemId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getListFilterId(value: string): string {
  return getListItemId(value);
}

export function getListArticleSearchText(list: ListArticleData): string[] {
  return list.items.flatMap((item) =>
    [item.title, item.description, item.meta, item.group].filter(
      (value): value is string => Boolean(value),
    ),
  );
}

export function getListArticlePlainText(list: ListArticleData): string {
  return getListArticleSearchText(list).join(' ');
}
