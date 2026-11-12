import path from 'node:path';
import {
  DIST_ROOT,
  readText,
  relativePath,
  reportIssues,
  routeExists,
  validateHtmlDocument,
  walkFiles,
  type ValidationIssue,
} from './quality-shared';

const htmlFiles = (await walkFiles(DIST_ROOT)).filter((file) =>
  file.endsWith('.html'),
);
const issues: ValidationIssue[] = [];

for (const file of htmlFiles) {
  const source = await readText(file);
  const fileName = relativePath(file);

  for (const message of validateHtmlDocument(source)) {
    issues.push({ file: fileName, message });
  }

  const hrefs = [...source.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter(
      (href) =>
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:'),
    );

  for (const href of hrefs) {
    if (!(await routeExists(href))) {
      issues.push({ file: fileName, message: `broken internal link: ${href}` });
    }
  }
}

if (htmlFiles.length === 0) {
  issues.push({
    file: path.relative(process.cwd(), DIST_ROOT),
    message: 'no built HTML files found; run bun run build first',
  });
}

reportIssues(
  issues,
  `Rendered accessibility and link validation passed for ${htmlFiles.length} pages.`,
);
