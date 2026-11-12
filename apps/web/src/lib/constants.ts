import { BLOG_ALL_CATEGORY_ID } from './articleRoutes';
import type { ContentCategory } from './types';

// Re-export directory entries to keep constants clean while maintaining compatibility
export * from './directory';
export * from './types';

export const SITE_NAME = 'Batcave';
export const HOME_PAGE_TITLE = 'Bruce Wayne - Personal Site & Blog';
export const SITE_HOST = 'example.com';
export const SITE_URL = `https://${SITE_HOST}`;
export const FOOTER_CREDIT = {
  label: 'potion.sh',
  href: 'https://potion.sh',
} as const;
export const SITE_DESCRIPTION =
  'Bruce Wayne’s fictional corner of the web: Wayne Enterprises by day, Batman after dark. A playful Batcave template demo.';
export const ABOUT_PAGE_DESCRIPTION =
  'A fictional look inside Bruce Wayne’s double life: philanthropy, gadgets, Gotham, and an unusually busy night shift.';
export const SEARCH_PAGE_DESCRIPTION = `Search blog posts, projects, bookmarks, wishlist, movie and TV ratings, reading, music, and information about Bruce Wayne across ${SITE_HOST}.`;
export const NOT_FOUND_PAGE_DESCRIPTION = `The requested page could not be found on ${SITE_HOST}. Search the site or return to the homepage.`;
export const NOT_FOUND_PAGE_CONTENT = {
  title: '404',
  pageTitle: `404 - Page Not Found - ${SITE_NAME}`,
  message: 'The page you are looking for does not exist.',
  homeLabel: 'Back to Home',
};
// Demo social links open platform homepages rather than impersonating accounts.
export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/';
export const GITHUB_PROFILE_URL = 'https://github.com/';
export const TWITTER_PROFILE_URL = 'https://x.com/';
export const YOUTUBE_PROFILE_URL = 'https://www.youtube.com/';
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/';
export const DISCORD_PROFILE_URL = 'https://discord.com/';
export const HOME_ACTIVITY_WEEKDAYS = ['Mon', 'Wed', 'Fri'];
export const PROJECTS_BACK_STORAGE_KEY = 'batcave:projects-back-url';
export const BLOG_BACK_STORAGE_KEY = 'batcave:blog-back-url';
export const BLOG_DESCRIPTION =
  'Notes from the Batcave on building gadgets, helping Gotham, and surviving another board meeting.';
export const BLOG_POSTS_LABEL = 'Posts';
export const BLOG_CATEGORY_FALLBACK_ICON = 'fa-solid fa-pen-nib';
export const BLOG_PAGE_COPY = {
  title: BLOG_POSTS_LABEL,
  subtitle:
    'Gotham field notes, Wayne Enterprises updates, and a few things Alfred asked me to write down.',
  allDescription: 'Every published post, across every category.',
  searchDescription: BLOG_DESCRIPTION,
};
export const ARTICLE_META_COPY = {
  published: 'Published',
  updated: 'Updated',
  readingTime: 'min read',
  readingTimeIcon: 'fa-solid fa-clock',
  tagsLabel: 'Post tags',
} as const;
export const BLOG_ALL_CATEGORY: ContentCategory = {
  id: BLOG_ALL_CATEGORY_ID,
  label: 'All',
  description: BLOG_PAGE_COPY.allDescription,
  icon: 'fa-solid fa-layer-group',
};
export const AUTHOR = {
  firstName: 'Bruce',
  lastName: 'Wayne',
  name: 'Bruce Wayne',
  role: 'Billionaire · Detective · Night owl',
  contactMessage:
    'Wayne Enterprises by day. Gotham rooftops by night. Alfred handles the calendar.',
};

export const TYPING_WORDS = [
  'debugging the Batcomputer',
  'funding a better Gotham',
  'testing a quieter Batmobile',
  'avoiding another gala',
  'asking Alfred for coffee',
];

export const SEARCH_PLACEHOLDER = 'Search posts, projects, and more...';
export const SEARCH_PAGE_PLACEHOLDER = `Search everything on ${SITE_HOST}`;
export const SEARCH_ARIA_LABEL = `Search ${SITE_HOST}`;

export const SOCIAL_LINKS = [
  { href: TWITTER_PROFILE_URL, icon: 'fa-brands fa-x-twitter', label: 'X' },
  { href: DISCORD_PROFILE_URL, icon: 'fa-brands fa-discord', label: 'Discord' },
  { href: GITHUB_PROFILE_URL, icon: 'fa-brands fa-github', label: 'GitHub' },
  {
    href: LINKEDIN_PROFILE_URL,
    icon: 'fa-brands fa-linkedin',
    label: 'LinkedIn',
  },
  { href: YOUTUBE_PROFILE_URL, icon: 'fa-brands fa-youtube', label: 'YouTube' },
  {
    href: INSTAGRAM_PROFILE_URL,
    icon: 'fa-brands fa-instagram',
    label: 'Instagram',
  },
];

export const POST_CATEGORIES: ContentCategory[] = [
  {
    id: 'gotham',
    label: 'Gotham',
    description: 'Rooftop observations and small ways to help the city.',
    icon: 'fa-solid fa-city',
  },
  {
    id: 'wayne-enterprises',
    label: 'Wayne Enterprises',
    description:
      'Research, philanthropy, and suspiciously specific expense reports.',
    icon: 'fa-solid fa-building',
  },
  {
    id: 'field-notes',
    label: 'Field Notes',
    description:
      'Lessons from the cape, the cave, and the occasional elevator.',
    icon: 'fa-solid fa-book-open',
  },
  {
    id: 'snippets',
    label: 'Snippets',
    description: 'Little bits of code from the Batcomputer.',
    icon: 'fa-solid fa-file-code',
  },
  {
    id: 'prompts',
    label: 'Prompts',
    description: 'Briefings that even a sleep-deprived detective can follow.',
    icon: 'fa-solid fa-wand-magic-sparkles',
  },
];

export const FALLBACK_CONTENT_CATEGORY: ContentCategory = {
  id: 'other',
  label: 'Other',
  description: 'Items that do not fit the current category set yet.',
};
