import { describe, expect, test, spyOn } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { AUTHOR, SITE_URL, SOCIAL_LINKS } from '../apps/web/src/lib/constants';
import { CONTACT_PROFILES } from '../apps/web/src/lib/contact';
import { DIRECTORY } from '../apps/web/src/lib/directory';
import { fetchGitHubActivity } from '../apps/web/src/lib/github';
import { PROJECTS } from '../apps/web/src/lib/projects';
import { WISHLIST } from '../apps/web/src/lib/wishlist';
import {
  BLOG_PAGE_SIZE,
  HOME_PICKS_MAX_COUNT,
} from '../apps/web/src/lib/config';
import {
  OPEN_SOURCE_PROJECTS,
  getFeaturedOpenSourceProjects,
  getOpenSourceSpotlight,
} from '../apps/web/src/lib/openSource';
import { SAMPLE_GITHUB_ACTIVITY } from '../apps/web/src/lib/sampleActivity';

// Demo links use platform homepages and never impersonate a personal account.
describe('template sample content', () => {
  test('uses platform homepages for social links and reserved URLs for fictional products', () => {
    expect(new URL(SITE_URL).hostname).toBe('example.com');
    const socialHomes = new Set([
      'https://x.com/',
      'https://discord.com/',
      'https://github.com/',
      'https://www.linkedin.com/',
      'https://www.youtube.com/',
      'https://www.instagram.com/',
    ]);
    const socialDestinations = [
      ...SOCIAL_LINKS.map((link) => link.href),
      ...CONTACT_PROFILES.map((profile) => profile.url),
    ];
    for (const destination of socialDestinations)
      expect(socialHomes.has(destination)).toBe(true);
    const destinations = [
      ...DIRECTORY.map((entry) => entry.url),
      ...PROJECTS.flatMap((project) =>
        project.actions.map((action) => action.href),
      ),
      ...OPEN_SOURCE_PROJECTS.flatMap((project) => [
        project.externalLink?.href,
      ]),
      ...WISHLIST.map((item) => item.url),
    ].filter((url): url is string => Boolean(url));
    for (const destination of destinations) {
      expect(new URL(destination).hostname).toBe('example.org');
    }
  });

  test('loads fictional activity without any network request', async () => {
    const request = spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error('Demo activity must not request remote data');
    });
    try {
      expect(await fetchGitHubActivity()).toEqual(SAMPLE_GITHUB_ACTIVITY);
      expect(request).not.toHaveBeenCalled();
    } finally {
      request.mockRestore();
    }
  });

  test('uses sample author and canonical URLs throughout published frontmatter', async () => {
    const folder = new URL(
      '../apps/web/src/content/articles/',
      import.meta.url,
    );
    const files = await readdir(folder, { recursive: true });
    const articles = files.filter((file) => file.endsWith('.md'));
    expect(articles.length).toBeGreaterThan(BLOG_PAGE_SIZE);
    let featuredCount = 0;
    for (const file of articles) {
      const source = await readFile(new URL(file, folder), 'utf8');
      if (source.includes('featured: true')) featuredCount++;
      expect(source).toContain(`author: "${AUTHOR.name}"`);
      expect(source).toMatch(/canonicalUrl: "https:\/\/example\.com\//);
      expect(source).not.toContain('discussion:');
    }
    expect(featuredCount).toBeGreaterThanOrEqual(HOME_PICKS_MAX_COUNT);
  });

  test('fills the showcase with a spotlight and two complete rows of tiles', () => {
    const projects = getFeaturedOpenSourceProjects();
    const spotlight = getOpenSourceSpotlight(projects);
    expect(spotlight).toBeDefined();
    expect(projects.filter((project) => project !== spotlight)).toHaveLength(6);
    expect(
      projects.every((project) => project.href === 'https://github.com/'),
    ).toBe(true);
  });
});
