import { getCollection } from 'astro:content';
import {
  BLOG_INDEX_PATH,
  FEATURED_WRITING_PATH,
  getBlogAllPath,
  getBlogCategoryPath,
} from '../lib/articleRoutes';
import {
  ACTIVE_DIRECTORY_CATEGORIES,
  DIRECTORY_PATH,
  getDirectoryCategoryPath,
} from '../lib/directory';
import {
  ACTIVE_MUSIC_CATEGORIES,
  getMusicCategoryPath,
  MUSIC_PATH,
} from '../lib/music';
import {
  ACTIVE_MOVIE_CATEGORIES,
  getMovieCategoryPath,
  MOVIES_PATH,
} from '../lib/movies';
import {
  ACTIVE_READING_CATEGORIES,
  getReadingCategoryPath,
  READING_PATH,
} from '../lib/reading';
import { SHELF_PATH } from '../lib/shelf';
import {
  ACTIVE_TV_SHOW_CATEGORIES,
  getTvShowCategoryPath,
  TV_SHOWS_PATH,
} from '../lib/tvShows';

import {
  ACTIVE_WISHLIST_CATEGORIES,
  getWishlistCategoryPath,
  WISHLIST_PATH,
} from '../lib/wishlist';
import { BLOG_PAGE_SIZE, PROJECTS_PAGE_SIZE } from '../lib/config';
import { filterVisibleContent, sortContentByPriority } from '../lib/content';
import { getAllFeaturedPosts } from '../lib/home';
import { getActiveBlogCategories } from '../lib/navHelper';
import { getPaginatedPaths, paginateItems } from '../lib/pagination';
import { getProjectPath, getVisibleProjects } from '../lib/projects';
import {
  createSitemapEntry,
  getLatestDate,
  type SitemapEntry,
  serializeSitemap,
} from '../lib/sitemap';
import {
  filterPostsByTag,
  getTagPath,
  getVisiblePostTags,
  TAGS_PATH,
} from '../lib/tags';
import { toCategoryId } from '../lib/utils';

export async function GET() {
  const posts = sortContentByPriority(
    filterVisibleContent(await getCollection('blog')),
  );
  const categories = await getActiveBlogCategories();
  const latestPostDate = getLatestDate(
    posts.map((post) => post.data.updatedDate),
  );
  const entries: SitemapEntry[] = [
    createSitemapEntry('/', 'home', latestPostDate),
    createSitemapEntry('/about', 'static'),
    createSitemapEntry('/contact', 'static'),
    createSitemapEntry('/books', 'resource-index'),
    createSitemapEntry('/projects', 'projects'),
    createSitemapEntry(BLOG_INDEX_PATH, 'resource-index', latestPostDate),
    createSitemapEntry(getBlogAllPath(), 'articles', latestPostDate),
    createSitemapEntry(
      FEATURED_WRITING_PATH,
      'articles',
      getLatestDate(
        getAllFeaturedPosts(posts).map((post) => post.data.updatedDate),
      ),
    ),
    createSitemapEntry(DIRECTORY_PATH, 'resource-index'),
    createSitemapEntry(WISHLIST_PATH, 'resource-index'),
    createSitemapEntry(MUSIC_PATH, 'resource-index'),
    createSitemapEntry(SHELF_PATH, 'resource-index'),
    createSitemapEntry(MOVIES_PATH, 'resource-index'),
    createSitemapEntry(TV_SHOWS_PATH, 'resource-index'),
    createSitemapEntry(READING_PATH, 'resource-index'),
    createSitemapEntry(TAGS_PATH, 'resource-index', latestPostDate),
  ];

  posts.forEach((post) => {
    entries.push(
      createSitemapEntry(
        post.data.canonicalUrl,
        'article',
        post.data.updatedDate,
      ),
    );
  });

  const articlePages = paginateItems(posts, 1, BLOG_PAGE_SIZE);
  getPaginatedPaths(getBlogAllPath(), articlePages.totalPages).forEach(
    (path, index) => {
      const page = paginateItems(posts, index + 2, BLOG_PAGE_SIZE);
      entries.push(
        createSitemapEntry(
          path,
          'article-pagination',
          getLatestDate(page.items.map((post) => post.data.updatedDate)),
        ),
      );
    },
  );

  categories.forEach((category) => {
    const categoryPath = getBlogCategoryPath(category);
    const categoryPosts = posts.filter(
      (post) => toCategoryId(post.data.category) === category.id,
    );
    const categoryPage = paginateItems(categoryPosts, 1, BLOG_PAGE_SIZE);
    const categoryDate = getLatestDate(
      categoryPosts.map((post) => post.data.updatedDate),
    );
    entries.push(
      createSitemapEntry(categoryPath, 'article-category', categoryDate),
    );

    getPaginatedPaths(categoryPath, categoryPage.totalPages).forEach(
      (path, index) => {
        const page = paginateItems(categoryPosts, index + 2, BLOG_PAGE_SIZE);
        entries.push(
          createSitemapEntry(
            path,
            'article-pagination',
            getLatestDate(page.items.map((post) => post.data.updatedDate)),
          ),
        );
      },
    );
  });

  getVisiblePostTags(posts).forEach((tag) => {
    const tagPosts = filterPostsByTag(posts, tag.id);
    const tagPath = getTagPath(tag);
    const tagPage = paginateItems(tagPosts, 1, BLOG_PAGE_SIZE);
    const tagDate = getLatestDate(
      tagPosts.map((post) => post.data.updatedDate),
    );
    entries.push(createSitemapEntry(tagPath, 'article-category', tagDate));

    getPaginatedPaths(tagPath, tagPage.totalPages).forEach((path, index) => {
      const page = paginateItems(tagPosts, index + 2, BLOG_PAGE_SIZE);
      entries.push(
        createSitemapEntry(
          path,
          'article-pagination',
          getLatestDate(page.items.map((post) => post.data.updatedDate)),
        ),
      );
    });
  });

  const visibleProjects = getVisibleProjects();
  const projectPages = paginateItems(visibleProjects, 1, PROJECTS_PAGE_SIZE);
  getPaginatedPaths('/projects', projectPages.totalPages).forEach((path) => {
    entries.push(createSitemapEntry(path, 'project-pagination'));
  });
  visibleProjects.forEach((project) => {
    entries.push(createSitemapEntry(getProjectPath(project), 'project'));
  });

  ACTIVE_DIRECTORY_CATEGORIES.forEach((category) => {
    entries.push(
      createSitemapEntry(getDirectoryCategoryPath(category), 'resource-detail'),
    );
  });

  ACTIVE_WISHLIST_CATEGORIES.forEach((category) => {
    entries.push(
      createSitemapEntry(getWishlistCategoryPath(category), 'resource-detail'),
    );
  });

  ACTIVE_MUSIC_CATEGORIES.forEach((category) => {
    entries.push(
      createSitemapEntry(getMusicCategoryPath(category), 'resource-detail'),
    );
  });

  ACTIVE_MOVIE_CATEGORIES.forEach((category) => {
    entries.push(
      createSitemapEntry(getMovieCategoryPath(category), 'resource-detail'),
    );
  });

  ACTIVE_TV_SHOW_CATEGORIES.forEach((category) => {
    entries.push(
      createSitemapEntry(getTvShowCategoryPath(category), 'resource-detail'),
    );
  });

  ACTIVE_READING_CATEGORIES.forEach((category) => {
    entries.push(
      createSitemapEntry(getReadingCategoryPath(category), 'resource-detail'),
    );
  });

  return new Response(serializeSitemap(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
