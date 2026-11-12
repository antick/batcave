import { SITE_URL } from './constants';
import { formatDateIso } from './utils';

export type SitemapEntryKind =
  | 'home'
  | 'static'
  | 'articles'
  | 'article-category'
  | 'article-pagination'
  | 'article'
  | 'projects'
  | 'project-pagination'
  | 'project'
  | 'resource-index'
  | 'resource-detail';

export interface SitemapEntry {
  url: string;
  changeFrequency: 'weekly' | 'monthly' | 'yearly';
  priority: number;
  lastModified?: Date;
}

const SITEMAP_RULES: Record<
  SitemapEntryKind,
  Omit<SitemapEntry, 'url' | 'lastModified'>
> = {
  home: { changeFrequency: 'weekly', priority: 1 },
  static: { changeFrequency: 'yearly', priority: 0.5 },
  articles: { changeFrequency: 'weekly', priority: 0.9 },
  'article-category': { changeFrequency: 'weekly', priority: 0.7 },
  'article-pagination': { changeFrequency: 'weekly', priority: 0.5 },
  article: { changeFrequency: 'monthly', priority: 0.8 },
  projects: { changeFrequency: 'monthly', priority: 0.8 },
  'project-pagination': { changeFrequency: 'monthly', priority: 0.5 },
  project: { changeFrequency: 'monthly', priority: 0.7 },
  'resource-index': { changeFrequency: 'monthly', priority: 0.7 },
  'resource-detail': { changeFrequency: 'monthly', priority: 0.6 },
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function createSitemapEntry(
  pathOrUrl: string,
  kind: SitemapEntryKind,
  lastModified?: Date,
): SitemapEntry {
  return {
    url: new URL(pathOrUrl, SITE_URL).toString(),
    ...SITEMAP_RULES[kind],
    lastModified,
  };
}

export function getLatestDate(dates: Date[]) {
  return dates.length > 0
    ? new Date(Math.max(...dates.map((date) => date.valueOf())))
    : undefined;
}

export function serializeSitemap(entries: SitemapEntry[]) {
  const urlXml = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `\n    <lastmod>${formatDateIso(entry.lastModified)}</lastmod>`
        : '';

      return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${lastModified}\n    <changefreq>${entry.changeFrequency}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlXml}\n</urlset>`;
}
