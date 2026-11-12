import { SAMPLE_ACTIVITY_DESCRIPTION } from './sampleActivity';
import type { CollectionEntry } from 'astro:content';
import {
  BLOG_INDEX_PATH,
  getArticlePath,
  getBlogAllPath,
} from './articleRoutes';
import { GITHUB_ACTIVITY_USERNAME, HOME_PICKS_MAX_COUNT } from './config';
import { GITHUB_PROFILE_URL } from './constants';
import { SHELF_DEFAULT_ICON, SHELF_PATH } from './shelf';
import { getContentDisplayTitle } from './content';
import { getVisiblePostTags, TAGS_PATH } from './tags';
import type { ContentCategory } from './types';
import { formatDateShort, formatMonthShort } from './utils';

const HOME_RECENT_LIMIT = HOME_PICKS_MAX_COUNT;
const PUBLISHING_MONTH_COUNT = 12;

export const HOME_WRITING_COPY = {
  label: '// writing',
  tabsLabel: 'Writing lists',
  featuredTab: 'Featured',
  recentTab: 'Recent',
  allPostsAction: 'All posts',
} as const;
export const FEATURED_WRITING_PAGE_COPY = {
  title: 'Featured writing',
  subtitle: 'Every post marked featured, newest first.',
  action: 'View all featured posts',
  empty: 'No featured posts yet.',
} as const;

export const HOME_STATS_LABEL = 'Site at a glance';

export const HOME_ACTIVITY_COPY = {
  label: '// activity',
  githubTitle: GITHUB_ACTIVITY_USERNAME ? 'GitHub' : 'Batcomputer activity',
  githubDescription: GITHUB_ACTIVITY_USERNAME
    ? 'Public contributions, last 26 weeks.'
    : SAMPLE_ACTIVITY_DESCRIPTION,
  publishingTitle: 'Publishing',
  publishingDescription: 'New posts, last 12 months.',
  outputLabel: 'Posts in 12 months',
  busiestMonthLabel: 'Busiest month',
  activeMonthsLabel: 'Active months',
  quietMonthValue: 'Quiet so far',
} as const;

interface HomePickCandidate {
  data: {
    featured: boolean;
    pubDate: Date;
  };
}

export interface HomePulseStat {
  label: string;
  value: number;
  href: string;
  icon: string;
  external?: boolean;
}

export interface HomePublishingMonth {
  id: string;
  label: string;
  shortLabel: string;
  count: number;
  height: number;
}

export interface HomeWritingItem {
  id: string;
  title: string;
  category: string;
  date: Date;
  href: string;
}

export interface HomePublishingInsights {
  postCount: number;
  activeMonthCount: number;
  busiestMonthLabel: string | null;
  busiestMonthCount: number;
}

export interface HomeSitePulse {
  stats: HomePulseStat[];
  publishing: HomePublishingMonth[];
  publishingInsights: HomePublishingInsights;
}

interface HomeSitePulseOptions {
  posts: CollectionEntry<'blog'>[];
  categories: ContentCategory[];
  projectCount: number;
  openSourceCount: number;
  shelfItemCount: number;
  referenceDate?: Date;
}

export function getAllFeaturedPosts<T extends HomePickCandidate>(
  posts: T[],
): T[] {
  return posts
    .filter((post) => post.data.featured)
    .sort(
      (first, second) =>
        second.data.pubDate.valueOf() - first.data.pubDate.valueOf(),
    );
}

export function getHomePicks<T extends HomePickCandidate>(posts: T[]): T[] {
  return getAllFeaturedPosts(posts).slice(0, HOME_PICKS_MAX_COUNT);
}

function getMonthId(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function buildPublishingActivity(
  posts: CollectionEntry<'blog'>[],
  referenceDate: Date,
): HomePublishingMonth[] {
  const months = Array.from({ length: PUBLISHING_MONTH_COUNT }, (_, index) => {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - index,
      1,
    );
    return {
      id: getMonthId(date),
      label: formatDateShort(date),
      shortLabel: formatMonthShort(date),
      count: 0,
      height: 0,
    };
  }).reverse();
  const monthById = new Map(months.map((month) => [month.id, month]));

  posts.forEach((post) => {
    const month = monthById.get(getMonthId(post.data.pubDate));
    if (month) month.count += 1;
  });

  const maximum = Math.max(1, ...months.map((month) => month.count));
  return months.map((month) => ({
    ...month,
    height: Math.round((month.count / maximum) * 100),
  }));
}

export function getPublishingInsights(
  publishing: HomePublishingMonth[],
): HomePublishingInsights {
  const activeMonths = publishing.filter((month) => month.count > 0);
  const busiestMonth = activeMonths.reduce<HomePublishingMonth | null>(
    (busiest, month) =>
      !busiest || month.count >= busiest.count ? month : busiest,
    null,
  );

  return {
    postCount: publishing.reduce((total, month) => total + month.count, 0),
    activeMonthCount: activeMonths.length,
    busiestMonthLabel: busiestMonth?.label ?? null,
    busiestMonthCount: busiestMonth?.count ?? 0,
  };
}

export function toHomeWritingItem(
  post: CollectionEntry<'blog'>,
): HomeWritingItem {
  return {
    id: `post-${post.id}`,
    title: getContentDisplayTitle(post),
    category: post.data.category,
    date: post.data.pubDate,
    href: getArticlePath(post.data),
  };
}

export function getRecentWriting(
  posts: CollectionEntry<'blog'>[],
): HomeWritingItem[] {
  return posts
    .map(toHomeWritingItem)
    .sort(
      (first, second) =>
        second.date.valueOf() - first.date.valueOf() ||
        first.title.localeCompare(second.title),
    )
    .slice(0, HOME_RECENT_LIMIT);
}

export function buildHomeSitePulse({
  posts,
  categories,
  projectCount,
  openSourceCount,
  shelfItemCount,
  referenceDate = new Date(),
}: HomeSitePulseOptions): HomeSitePulse {
  const publishing = buildPublishingActivity(posts, referenceDate);

  return {
    stats: [
      {
        label: 'Posts',
        value: posts.length,
        href: getBlogAllPath(),
        icon: 'fa-solid fa-pen-nib',
      },
      {
        label: 'Categories',
        value: categories.length,
        href: BLOG_INDEX_PATH,
        icon: 'fa-solid fa-shapes',
      },
      {
        label: 'Tags',
        value: getVisiblePostTags(posts).length,
        href: TAGS_PATH,
        icon: 'fa-solid fa-tags',
      },
      {
        label: 'Projects',
        value: projectCount,
        href: '/projects',
        icon: 'fa-solid fa-folder-open',
      },
      {
        label: 'Open source',
        value: openSourceCount,
        href: GITHUB_PROFILE_URL,
        icon: 'fa-brands fa-github',
        external: true,
      },
      {
        label: 'Shelf items',
        value: shelfItemCount,
        href: SHELF_PATH,
        icon: SHELF_DEFAULT_ICON,
      },
    ],
    publishing,
    publishingInsights: getPublishingInsights(publishing),
  };
}
