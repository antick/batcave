import { describe, expect, test } from 'bun:test';
import {
  getFeaturedOpenSourceProjects,
  getOpenSourceKinds,
  getOpenSourceSpotlight,
} from '../apps/web/src/lib/openSource';

describe('homepage open-source selection', () => {
  test('keeps only featured repositories in their curated order', () => {
    const repositories = [
      {
        slug: 'first-featured',
        title: 'First featured',
        description: 'First featured repository.',
        href: 'https://example.com/repositories/first-featured',
        icon: 'fa-solid fa-code',
        kind: 'Tool',
        tags: ['TypeScript'],
        featured: true,
      },
      {
        slug: 'not-featured',
        title: 'Not featured',
        description: 'Repository kept off the homepage.',
        href: 'https://example.com/repositories/not-featured',
        icon: 'fa-solid fa-code',
        kind: 'Tool',
        tags: ['TypeScript'],
        featured: false,
      },
      {
        slug: 'second-featured',
        title: 'Second featured',
        description: 'Second featured repository.',
        href: 'https://example.com/repositories/second-featured',
        icon: 'fa-solid fa-code',
        kind: 'Template',
        tags: ['Astro'],
        featured: true,
      },
    ];

    expect(
      getFeaturedOpenSourceProjects(repositories).map(
        (repository) => repository.slug,
      ),
    ).toEqual(['first-featured', 'second-featured']);
  });

  test('picks the first spotlight project and counts kinds in order', () => {
    const base = {
      description: 'Repository.',
      href: 'https://example.com/repositories/repo',
      icon: 'fa-solid fa-code',
      tags: [],
      featured: true,
    };
    const projects = [
      { ...base, slug: 'one', title: 'One', kind: 'Desktop app' },
      { ...base, slug: 'two', title: 'Two', kind: 'CLI', spotlight: true },
      { ...base, slug: 'three', title: 'Three', kind: 'Desktop app' },
    ];

    expect(getOpenSourceSpotlight(projects)?.slug).toBe('two');
    expect(getOpenSourceKinds(projects)).toEqual([
      { id: 'desktop-app', label: 'Desktop app', count: 2 },
      { id: 'cli', label: 'CLI', count: 1 },
    ]);
  });
});
