import { getCollection } from 'astro:content';
import { getBlogCategories, getBlogListingCategories } from './blog';
import { filterVisibleContent } from './content';
import { SITE_NAV_ITEMS, type NavItem } from './navigation';

export async function getActiveBlogCategories() {
  const allPosts = filterVisibleContent(await getCollection('blog'));
  return getBlogCategories(allPosts);
}

export async function getActiveBlogListingCategories() {
  return getBlogListingCategories(await getActiveBlogCategories());
}

export function getDynamicNavItems(): Promise<NavItem[]> {
  return Promise.resolve(SITE_NAV_ITEMS);
}
