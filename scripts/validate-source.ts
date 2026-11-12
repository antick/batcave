import path from 'node:path';
import {
  MAX_CODE_FILE_LINES,
  SOURCE_ROOT,
  countLines,
  isCodeFile,
  readText,
  relativePath,
  reportIssues,
  walkFiles,
  type ValidationIssue,
} from './quality-shared';

const REMOTE_ASSET_PATTERN =
  /<(?:link|script)\b[^>]*(?:href|src)=["']https?:\/\//i;
const TARGET_BLANK_PATTERN = /<a\b[^>]*target=["']_blank["'][^>]*>/gi;
const SAFE_REL_PATTERN =
  /rel=["'][^"']*\bnoopener\b[^"']*\bnoreferrer\b[^"']*["']/i;
const CONTENT_ROOT = path.join(SOURCE_ROOT, 'content/articles');

function parseFrontmatter(source: string): Record<string, string> {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  return Object.fromEntries(
    [
      ...frontmatter.matchAll(/^([A-Za-z][\w]*):\s*["']?([^"'\n]+)["']?\s*$/gm),
    ].map((match) => [match[1], match[2].trim()]),
  );
}

const files = await walkFiles(SOURCE_ROOT);
const issues: ValidationIssue[] = [];

for (const file of files.filter(isCodeFile)) {
  const source = await readText(file);
  const fileName = relativePath(file);
  const lineCount = countLines(source);

  if (lineCount > MAX_CODE_FILE_LINES) {
    issues.push({
      file: fileName,
      message: `${lineCount} lines exceeds the ${MAX_CODE_FILE_LINES}-line code limit`,
    });
  }
  if (REMOTE_ASSET_PATTERN.test(source)) {
    issues.push({
      file: fileName,
      message: 'remote stylesheet or script dependency found',
    });
  }
  for (const link of source.match(TARGET_BLANK_PATTERN) ?? []) {
    if (!SAFE_REL_PATTERN.test(link)) {
      issues.push({
        file: fileName,
        message: 'target=_blank link is missing noopener noreferrer',
      });
    }
  }
}

const articleFiles = (await walkFiles(CONTENT_ROOT)).filter((file) =>
  file.endsWith('.md'),
);
const articles = await Promise.all(
  articleFiles.map(async (file) => ({
    file,
    data: parseFrontmatter(await readText(file)),
  })),
);
const slugs = new Set<string>();

for (const article of articles) {
  const fileName = relativePath(article.file);
  const { slug, pubDate, updatedDate } = article.data;
  if (!slug) issues.push({ file: fileName, message: 'missing slug' });
  if (slug && slugs.has(slug))
    issues.push({ file: fileName, message: `duplicate article slug: ${slug}` });
  if (slug) slugs.add(slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pubDate ?? '')) {
    issues.push({ file: fileName, message: 'pubDate must use YYYY-MM-DD' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedDate ?? '')) {
    issues.push({ file: fileName, message: 'updatedDate must use YYYY-MM-DD' });
  }
  if (pubDate && updatedDate && updatedDate < pubDate) {
    issues.push({
      file: fileName,
      message: 'updatedDate cannot precede pubDate',
    });
  }
}

reportIssues(
  issues,
  `Source validation passed for ${files.length} files and ${articles.length} articles.`,
);
