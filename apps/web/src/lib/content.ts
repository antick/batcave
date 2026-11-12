import { BLOG_ALL_CATEGORY_ID } from './articleRoutes';
import {
  ARTICLE_READING_WORDS_PER_MINUTE,
  ARTICLE_TOC_HEADING_DEPTH,
  SHOW_DRAFT_CONTENT_IN_DEV,
} from './config';
import { toCategoryId } from './utils';

export const RELATED_CONTENT_HEADING = 'Related content';

export const DEFAULT_CONTENT_IMAGES = {
  light: '/images/content/sample-content-light.svg',
  dark: '/images/content/sample-content-dark.svg',
} as const;

interface DraftableContent {
  data: {
    draft: boolean;
  };
}

interface TitledDraftableContent extends DraftableContent {
  data: {
    draft: boolean;
    title: string;
  };
}

interface PrioritizedContent {
  data: {
    featured: boolean;
    pubDate: Date;
    slug: string;
  };
}

interface RelatedContentEntry {
  data: {
    slug: string;
    relatedPosts: string[];
  };
}

export interface ContentSeoData {
  draft: boolean;
  seoTitle: string;
  description: string;
  canonicalUrl: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  socialCardType: 'summary' | 'summary_large_image';
  schemaType: 'Article' | 'BlogPosting' | 'TechArticle';
  language: string;
  author: string;
  authorUrl: string;
  pubDate: Date;
  updatedDate: Date;
}

export function shouldShowDraftContent() {
  return import.meta.env.DEV && SHOW_DRAFT_CONTENT_IN_DEV;
}

export function filterVisibleContent<T extends DraftableContent>(entries: T[]) {
  return entries.filter(
    (entry) => !entry.data.draft || shouldShowDraftContent(),
  );
}

export function filterPostsByBlogCategory<
  T extends { data: { category: string } },
>(posts: T[], categoryId: string): T[] {
  if (categoryId === BLOG_ALL_CATEGORY_ID) return posts;
  return posts.filter(
    (post) => toCategoryId(post.data.category) === categoryId,
  );
}

export function getContentDisplayTitle(entry: TitledDraftableContent) {
  return entry.data.draft && shouldShowDraftContent()
    ? `[DRAFT] ${entry.data.title}`
    : entry.data.title;
}

export function sortContentByPriority<T extends PrioritizedContent>(
  entries: T[],
) {
  return [...entries].sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    const dateDifference = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    return dateDifference || a.data.slug.localeCompare(b.data.slug);
  });
}

export function validateRelatedContentReferences<T extends RelatedContentEntry>(
  entries: T[],
) {
  const availableSlugs = new Set(entries.map((entry) => entry.data.slug));
  const unresolvedReferences = entries.flatMap((entry) =>
    entry.data.relatedPosts
      .filter((relatedSlug) => !availableSlugs.has(relatedSlug))
      .map((relatedSlug) => `${entry.data.slug} -> ${relatedSlug}`),
  );

  if (unresolvedReferences.length > 0) {
    throw new Error(
      `Invalid relatedPosts references:\n${unresolvedReferences.map((reference) => `- ${reference}`).join('\n')}\nEvery relatedPosts slug must match a visible article slug.`,
    );
  }
}

export function getRelatedContent<T extends { data: { slug: string } }>(
  entries: T[],
  relatedSlugs: string[],
) {
  const entriesBySlug = new Map(
    entries.map((entry) => [entry.data.slug, entry]),
  );
  return relatedSlugs.flatMap((slug) => {
    const entry = entriesBySlug.get(slug);
    return entry ? [entry] : [];
  });
}

export function getContentImage(data: {
  ogImage: string;
  ogImageDark: string;
  ogImageAlt: string;
}) {
  return {
    light: data.ogImage,
    dark: data.ogImageDark,
    alt: data.ogImageAlt,
  };
}

export function getArticleTocHeadings<T extends { depth: number }>(
  headings: T[],
) {
  return headings.filter(({ depth }) => depth === ARTICLE_TOC_HEADING_DEPTH);
}

export function shouldRenderArticleTableOfContents(
  headings: { depth: number }[],
  isPromptArticle: boolean,
) {
  return !isPromptArticle && getArticleTocHeadings(headings).length > 0;
}

interface ArticlePresentationData {
  prompt?: unknown;
  list?: {
    showFeaturedImage?: boolean;
    showRelatedPosts?: boolean;
  };
}

export function shouldShowArticleFeaturedImage(data: ArticlePresentationData) {
  return data.list ? Boolean(data.list.showFeaturedImage) : true;
}

export function shouldShowArticleRelatedPosts(data: ArticlePresentationData) {
  if (data.prompt) return false;
  return data.list ? Boolean(data.list.showRelatedPosts) : true;
}

export function shouldShowArticleHeaderMeta(data: { list?: unknown }) {
  return !data.list;
}

export function getEstimatedReadingMinutes(markdown: string) {
  const readableText = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|-]/g, ' ');
  const wordCount = readableText.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / ARTICLE_READING_WORDS_PER_MINUTE));
}
