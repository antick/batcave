import { GITHUB_PROFILE_URL } from './constants';
import { toCategoryId } from './utils';

export interface OpenSourceProject {
  slug: string;
  title: string;
  description: string;
  href: string;
  externalLink?: {
    href: string;
    label: string;
    icon: string;
  };
  icon: string;
  kind: string;
  tags: string[];
  featured: boolean;
  /** Shown as the large homepage card. Only the first spotlight project is used. */
  spotlight?: boolean;
  /** Optional one-line install or run command shown on the spotlight card. */
  install?: string;
}

export interface OpenSourceKind {
  id: string;
  label: string;
  count: number;
}

const websiteLink = (href: string) => ({
  href,
  label: 'Visit website',
  icon: 'fa-solid fa-globe',
});

export const OPEN_SOURCE_PAGE_COPY = {
  label: '// built in the batcave',
  repositoryAction: 'View on GitHub',
  repositoryButton: 'Source',
  websiteButton: 'Website',
  spotlightBadge: 'Wayne R&D',
  filterLabel: 'Filter projects by type',
  allFilter: 'All',
  action: 'Explore all repositories',
} as const;

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    slug: 'batcomputer',
    title: 'Batcomputer',
    description:
      'Gotham’s maps, case notes, and one very persistent software update.',
    href: GITHUB_PROFILE_URL,
    externalLink: websiteLink('https://example.org/projects/batcomputer'),
    icon: 'fa-solid fa-desktop',
    kind: 'Command center',
    tags: ['TypeScript', 'Gotham'],
    featured: true,
    spotlight: true,
  },
  {
    slug: 'gotham-atlas',
    title: 'Gotham Atlas',
    description:
      'A city guide with rooftop routes and coffee stops Alfred approves of.',
    href: GITHUB_PROFILE_URL,
    externalLink: websiteLink('https://example.org/projects/gotham-atlas'),
    icon: 'fa-solid fa-map-location-dot',
    kind: 'Web app',
    tags: ['Maps', 'Astro'],
    featured: true,
    spotlight: false,
  },
  {
    slug: 'utility-belt',
    title: 'Utility Belt',
    description:
      'A pocket-sized inventory. The shark repellent gets its own category.',
    href: GITHUB_PROFILE_URL,
    externalLink: websiteLink('https://example.org/projects/utility-belt'),
    icon: 'fa-solid fa-toolbox',
    kind: 'CLI',
    tags: ['Inventory', 'Bun'],
    featured: true,
    spotlight: false,
  },
  {
    slug: 'batmobile-log',
    title: 'Batmobile Log',
    description:
      'Mileage, repairs, and a tire budget that deserves its own board meeting.',
    href: GITHUB_PROFILE_URL,
    externalLink: websiteLink('https://example.org/projects/batmobile-log'),
    icon: 'fa-solid fa-car',
    kind: 'Desktop app',
    tags: ['Logs', 'TypeScript'],
    featured: true,
    spotlight: false,
  },
  {
    slug: 'wayne-foundation',
    title: 'Wayne Foundation',
    description:
      'Small projects for a brighter Gotham, starting at street level.',
    href: GITHUB_PROFILE_URL,
    externalLink: websiteLink('https://example.org/projects/wayne-foundation'),
    icon: 'fa-solid fa-building',
    kind: 'Web app',
    tags: ['Community', 'Astro'],
    featured: true,
    spotlight: false,
  },
  {
    slug: 'casefile-index',
    title: 'Casefile Index',
    description:
      'Clues, connections, and the sticky note that cracked the case.',
    href: GITHUB_PROFILE_URL,
    externalLink: websiteLink('https://example.org/projects/casefile-index'),
    icon: 'fa-solid fa-magnifying-glass',
    kind: 'Desktop app',
    tags: ['Search', 'TypeScript'],
    featured: true,
    spotlight: false,
  },
  {
    slug: 'alfred-calendar',
    title: 'Alfred’s Calendar',
    description: 'One reminder for every gala Bruce is about to miss.',
    href: GITHUB_PROFILE_URL,
    externalLink: websiteLink('https://example.org/projects/alfred-calendar'),
    icon: 'fa-solid fa-calendar-days',
    kind: 'CLI',
    tags: ['Planning', 'Bun'],
    featured: true,
    spotlight: false,
  },
];

export function getFeaturedOpenSourceProjects(
  projects: OpenSourceProject[] = OPEN_SOURCE_PROJECTS,
): OpenSourceProject[] {
  return projects.filter((project) => project.featured);
}

export function getOpenSourceSpotlight(
  projects: OpenSourceProject[] = getFeaturedOpenSourceProjects(),
): OpenSourceProject | undefined {
  return projects.find((project) => project.spotlight);
}

/** Distinct project kinds in first-seen order, for the homepage filter. */
export function getOpenSourceKinds(
  projects: OpenSourceProject[] = getFeaturedOpenSourceProjects(),
): OpenSourceKind[] {
  const kinds = new Map<string, OpenSourceKind>();
  projects.forEach(({ kind }) => {
    const id = toCategoryId(kind);
    const existing = kinds.get(id);
    if (existing) existing.count += 1;
    else kinds.set(id, { id, label: kind, count: 1 });
  });
  return [...kinds.values()];
}
