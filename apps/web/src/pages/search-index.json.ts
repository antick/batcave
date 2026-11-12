import { getCollection } from 'astro:content';
import { filterVisibleContent } from '../lib/content';
import { buildSearchIndex, serializeSearchIndex } from '../lib/search';

export const prerender = true;

export async function GET(): Promise<Response> {
  const posts = filterVisibleContent(await getCollection('blog'));
  const searchIndex = serializeSearchIndex(buildSearchIndex(posts));

  return new Response(searchIndex, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
