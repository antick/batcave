import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { SITE_URL } from '../apps/web/src/lib/constants';

export const REPOSITORY_ROOT = path.resolve(import.meta.dir, '..');
export const SOURCE_ROOT = path.join(REPOSITORY_ROOT, 'apps/web/src');
export const DIST_ROOT = path.join(REPOSITORY_ROOT, 'apps/web/dist');
export const MAX_CODE_FILE_LINES = 500;

const CODE_EXTENSIONS = new Set([
  '.astro',
  '.css',
  '.js',
  '.mjs',
  '.ts',
  '.tsx',
]);
const SKIPPED_DIRECTORIES = new Set([
  '.astro',
  '.git',
  '.turbo',
  'dist',
  'node_modules',
]);

export interface ValidationIssue {
  file: string;
  message: string;
}

export async function walkFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(root, entry.name);
      if (entry.isDirectory()) {
        return SKIPPED_DIRECTORIES.has(entry.name) ? [] : walkFiles(entryPath);
      }
      return entry.isFile() ? [entryPath] : [];
    }),
  );

  return files.flat();
}

export function isCodeFile(file: string): boolean {
  return CODE_EXTENSIONS.has(path.extname(file));
}

export function relativePath(file: string): string {
  return path.relative(REPOSITORY_ROOT, file);
}

export function countLines(source: string): number {
  return source === '' ? 0 : source.split(/\r?\n/).length;
}

export function getHtmlAttribute(
  tag: string,
  attribute: string,
): string | undefined {
  const match = tag.match(
    new RegExp(`\\s${attribute}=(?:"([^"]*)"|'([^']*)')`, 'i'),
  );
  return match?.[1] ?? match?.[2];
}

export function stripMarkup(source: string): string {
  return source
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function validateHtmlDocument(source: string): string[] {
  const issues: string[] = [];
  const h1Count = source.match(/<h1\b/gi)?.length ?? 0;
  const mainCount = source.match(/<main\b/gi)?.length ?? 0;

  if (h1Count !== 1) issues.push(`expected exactly one h1, found ${h1Count}`);
  if (mainCount !== 1)
    issues.push(`expected exactly one main landmark, found ${mainCount}`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(source)) {
    issues.push('missing non-empty meta description');
  }
  if (!/<link\s+rel="canonical"\s+href="[^"]+"/i.test(source)) {
    issues.push('missing canonical link');
  }

  for (const image of source.match(/<img\b[^>]*>/gi) ?? []) {
    if (getHtmlAttribute(image, 'alt') === undefined)
      issues.push('image is missing alt text');
  }

  for (const button of source.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) ??
    []) {
    const openingTag = button.match(/<button\b[^>]*>/i)?.[0] ?? '';
    const name =
      getHtmlAttribute(openingTag, 'aria-label') ?? stripMarkup(button);
    if (!name) issues.push('button has no accessible name');
  }

  for (const link of source.match(/<a\b[^>]*>/gi) ?? []) {
    if (getHtmlAttribute(link, 'target') !== '_blank') continue;
    const rel = getHtmlAttribute(link, 'rel')?.split(/\s+/) ?? [];
    if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
      issues.push('external target=_blank link is missing noopener noreferrer');
    }
  }

  const ids = [...source.matchAll(/\sid="([^"]+)"/gi)].map((match) => match[1]);
  const duplicateIds = [
    ...new Set(ids.filter((id, index) => ids.indexOf(id) !== index)),
  ];
  if (duplicateIds.length > 0)
    issues.push(`duplicate ids: ${duplicateIds.join(', ')}`);

  return issues;
}

export async function routeExists(href: string): Promise<boolean> {
  const url = new URL(href, SITE_URL);
  if (url.origin !== SITE_URL) return true;
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/_astro/')
  )
    return true;

  const route = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');
  const candidates = route
    ? [
        path.join(DIST_ROOT, route, 'index.html'),
        path.join(DIST_ROOT, `${route}.html`),
        path.join(DIST_ROOT, route),
      ]
    : [path.join(DIST_ROOT, 'index.html')];

  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return true;
    } catch {}
  }

  return false;
}

export async function readText(file: string): Promise<string> {
  return readFile(file, 'utf8');
}

export function reportIssues(
  issues: ValidationIssue[],
  successMessage: string,
): void {
  if (issues.length === 0) {
    console.log(successMessage);
    return;
  }

  for (const issue of issues) console.error(`${issue.file}: ${issue.message}`);
  process.exitCode = 1;
}
