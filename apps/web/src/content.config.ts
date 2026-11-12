import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  isReservedArticleSlug,
  isReservedBlogCategoryId,
} from './lib/articleRoutes';
import {
  LIST_ARTICLE_SHOW_FEATURED_IMAGE,
  LIST_ARTICLE_SHOW_RELATED_POSTS,
} from './lib/config';
import { toCategoryId } from './lib/utils';

const contentSchema = z.object({
  title: z.string(),
  seoTitle: z.string(),
  description: z.string(),
  excerpt: z.string(),
  slug: z.string().refine((slug) => !isReservedArticleSlug(slug), {
    message: 'Article slug conflicts with a reserved top-level route.',
  }),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date(),
  author: z.string(),
  authorUrl: z.string(),
  category: z
    .string()
    .refine((category) => !isReservedBlogCategoryId(toCategoryId(category)), {
      message: 'Article category conflicts with a reserved blog listing route.',
    }),
  tags: z.array(z.string()).default([]),
  featured: z.boolean(),
  draft: z.boolean(),
  canonicalUrl: z.url(),
  robots: z.object({
    index: z.boolean(),
    follow: z.boolean(),
  }),
  ogImage: z.string(),
  ogImageDark: z.string(),
  ogImageAlt: z.string(),
  ogImageWidth: z.number().int().positive(),
  ogImageHeight: z.number().int().positive(),
  socialCardType: z.enum(['summary', 'summary_large_image']),
  schemaType: z.enum(['Article', 'BlogPosting', 'TechArticle']),
  language: z.string(),
  relatedPosts: z.array(z.string()).default([]),
  prompt: z
    .object({
      useCase: z.string(),
      details: z.array(z.string()).default([]),
    })
    .optional(),
  list: z
    .object({
      layout: z.enum(['detailed', 'compact']).default('detailed'),
      showFeaturedImage: z.boolean().default(LIST_ARTICLE_SHOW_FEATURED_IMAGE),
      showRelatedPosts: z.boolean().default(LIST_ARTICLE_SHOW_RELATED_POSTS),
      items: z
        .array(
          z.object({
            title: z.string(),
            description: z.string().optional(),
            meta: z.string().optional(),
            group: z.string().optional(),
          }),
        )
        .min(1),
    })
    .optional(),
  discussion: z
    .object({
      provider: z.literal('x'),
      url: z.url().refine((url) => /^https:\/\/(?:www\.)?x\.com\//.test(url), {
        message: 'X discussion URLs must use https://x.com/.',
      }),
    })
    .optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: contentSchema,
});

export const collections = {
  blog,
};
