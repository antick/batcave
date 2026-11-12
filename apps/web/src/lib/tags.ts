import { SITE_HOST } from './constants';
import { toCategoryId } from './utils';

export const TAGS_PATH = '/tags';
export const TAG_PAGINATION_SEGMENT = 'page';
export const RESERVED_TAG_IDS = [TAG_PAGINATION_SEGMENT] as const;

export const TAGS_PAGE_COPY = {
  title: 'Tags',
  subtitle: 'Topics currently attached to published posts.',
  searchDescription: `Browse every tag used on published ${SITE_HOST} posts.`,
  sortedByFrequency: 'Sorted by how often they appear.',
  postsLabel: 'post',
  postsLabelPlural: 'posts',
} as const;

export interface PostTag {
  id: string;
  label: string;
  count: number;
}

const reservedTagIds = new Set<string>(RESERVED_TAG_IDS);

export function getTagId(tag: string) {
  return toCategoryId(tag);
}

export function getTagPath(tag: { id: string }) {
  return `${TAGS_PATH}/${tag.id}`;
}

export function isReservedTagId(id: string) {
  return reservedTagIds.has(id);
}

export function getVisiblePostTags(
  posts: { data: { tags?: string[] } }[],
): PostTag[] {
  const tags = new Map<string, { label: string; count: number }>();

  posts.forEach((post) => {
    const seen = new Set<string>();

    (post.data.tags ?? []).forEach((rawTag) => {
      const label = rawTag.trim();
      if (!label) {
        return;
      }

      const id = getTagId(label);
      if (isReservedTagId(id)) {
        throw new Error(
          `Article tag "${label}" conflicts with a reserved tags listing route.`,
        );
      }
      if (seen.has(id)) {
        return;
      }

      seen.add(id);
      const existing = tags.get(id);
      if (existing) {
        existing.count += 1;
        return;
      }

      tags.set(id, { label, count: 1 });
    });
  });

  return [...tags.entries()]
    .map(([id, value]) => ({ id, ...value }))
    .sort(
      (first, second) =>
        second.count - first.count || first.label.localeCompare(second.label),
    );
}

export function getPostTag(
  tags: PostTag[],
  tagId: string,
): PostTag | undefined {
  return tags.find((tag) => tag.id === tagId);
}

export function filterPostsByTag<T extends { data: { tags?: string[] } }>(
  posts: T[],
  tagId: string,
): T[] {
  return posts.filter((post) =>
    (post.data.tags ?? []).some((tag) => getTagId(tag) === tagId),
  );
}

export function getTagPostsLabel(count: number) {
  return count === 1
    ? TAGS_PAGE_COPY.postsLabel
    : TAGS_PAGE_COPY.postsLabelPlural;
}

export function getTagListingTitle(tag: PostTag) {
  return `Posts tagged ${tag.label}`;
}

export function getTagListingDescription(tag: PostTag) {
  return `Published posts tagged ${tag.label}.`;
}
