import { describe, expect, test } from 'bun:test';
import { isReservedArticleSlug } from '../apps/web/src/lib/articleRoutes';
import {
  filterPostsByTag,
  getTagId,
  getTagPath,
  getTagPostsLabel,
  getVisiblePostTags,
  isReservedTagId,
  TAGS_PATH,
} from '../apps/web/src/lib/tags';

function post(slug: string, tags: string[]) {
  return {
    data: {
      slug,
      tags,
    },
  };
}

describe('post tags', () => {
  test('builds unique tag counts and paths from visible posts', () => {
    const tags = getVisiblePostTags([
      post('one', ['AI', 'engineering', 'AI']),
      post('two', ['engineering', 'tools']),
      post('three', ['  ', 'tools']),
    ]);

    expect(tags).toEqual([
      { id: 'engineering', label: 'engineering', count: 2 },
      { id: 'tools', label: 'tools', count: 2 },
      { id: 'ai', label: 'AI', count: 1 },
    ]);
    expect(getTagPath(tags[0])).toBe('/tags/engineering');
    expect(TAGS_PATH).toBe('/tags');
    expect(getTagId('Software Development')).toBe('software-development');
    expect(getTagPostsLabel(1)).toBe('post');
    expect(getTagPostsLabel(2)).toBe('posts');
  });

  test('filters posts by tag id and reserves the tags route', () => {
    const posts = [
      post('one', ['AI']),
      post('two', ['engineering']),
      post('three', ['ai assistants']),
    ];

    expect(filterPostsByTag(posts, 'ai').map((item) => item.data.slug)).toEqual(
      ['one'],
    );
    expect(isReservedArticleSlug('tags')).toBe(true);
    expect(isReservedTagId('page')).toBe(true);
    expect(isReservedTagId('engineering')).toBe(false);
  });

  test('rejects a tag that collides with the pagination segment', () => {
    expect(() => getVisiblePostTags([post('one', ['page'])])).toThrow(
      'reserved tags listing route',
    );
  });
});
