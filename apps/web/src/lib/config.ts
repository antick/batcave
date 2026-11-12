// Empty by default: display fictional activity without contacting GitHub.
// Set this to your GitHub username and update GITHUB_PROFILE_URL to enable live data.
export const GITHUB_ACTIVITY_USERNAME = '';
export const ENABLE_ANALYTICS = false;
/**
 * Runtime configuration that may be sourced from environment variables later.
 * Keep defaults here until environment-specific deployment configuration is needed.
 */
export const SHOW_DRAFT_CONTENT_IN_DEV = false;
export const GITHUB_ACTIVITY_CACHE_TTL_MS = 2 * 60 * 60 * 1000;
export const GITHUB_ACTIVITY_RECENT_WEEKS = 26;
export const HOME_PICKS_MAX_COUNT = 7;
export const PROJECTS_PAGE_SIZE = 6;
export const BLOG_PAGE_SIZE = 6;
export const SEARCH_PREVIEW_LIMIT = 6;
export const SEARCH_PAGE_LIMIT = 48;
export const ARTICLE_READING_WORDS_PER_MINUTE = 220;
export const ARTICLE_TOC_HEADING_DEPTH = 2;
export const LIST_ARTICLE_SHOW_FEATURED_IMAGE = false;
export const LIST_ARTICLE_SHOW_RELATED_POSTS = false;
