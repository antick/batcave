import { shouldShowDraftContent } from './content';
import type { ThemeImage } from './types';

export interface ProjectAction {
  href: string;
  label: string;
  icon: string;
}

export type ProjectStatus = 'In progress' | 'Live' | 'Planning';

export interface Project {
  slug: string;
  title: string;
  description: string;
  summary: string;
  tags: string[];
  status: ProjectStatus;
  draft: boolean;
  image: ThemeImage;
  actions: ProjectAction[];
  techStack: string[];
  highlights: string[];
}

type ProjectDefinition = Omit<Project, 'status' | 'draft' | 'image'>;

interface ProjectOptions {
  status?: ProjectStatus;
  draft?: boolean;
}

const IN_PROGRESS_STATUS: ProjectStatus = 'In progress';
const LIVE_STATUS: ProjectStatus = 'Live';
const PLANNING_STATUS: ProjectStatus = 'Planning';
const EXTERNAL_LINK_ICON = 'fa-solid fa-arrow-up-right-from-square';

export const PROJECTS_PAGE_COPY = {
  intro:
    'From the Batcomputer to Alfred’s calendar: fictional projects built for Bruce Wayne’s double life.',
  searchDescription:
    'Bruce Wayne’s fictional gadgets, research tools, and Gotham community projects.',
};

function externalAction(href: string, label: string): ProjectAction {
  return { href, label, icon: EXTERNAL_LINK_ICON };
}

function createProject(
  project: ProjectDefinition,
  options: ProjectOptions = {},
): Project {
  return {
    ...project,
    status: options.status ?? IN_PROGRESS_STATUS,
    draft: options.draft ?? false,
    image: {
      light: `/images/projects/${project.slug}-light.svg`,
      dark: `/images/projects/${project.slug}-dark.svg`,
      alt: project.title,
    },
  };
}

export function getProjectStatusTone(
  status: ProjectStatus,
): 'live' | 'progress' | 'planning' | undefined {
  if (status === LIVE_STATUS) return 'live';
  if (status === IN_PROGRESS_STATUS) return 'progress';
  if (status === PLANNING_STATUS) return 'planning';
  return undefined;
}

export const PROJECTS: Project[] = [
  createProject(
    {
      slug: 'batcomputer',
      title: 'Batcomputer',
      description:
        'A command center for Gotham maps, case notes, and Alfred’s increasingly urgent reminders.',
      summary:
        'Batcomputer: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Dashboard', 'Gotham'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/batcomputer',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Gotham.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'Live', draft: false },
  ),
  createProject(
    {
      slug: 'gotham-atlas',
      title: 'Gotham Atlas',
      description:
        'A rooftop-friendly city guide with landmarks, public shelters, and excellent late-night coffee.',
      summary:
        'Gotham Atlas: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Maps', 'Community'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/gotham-atlas',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Gotham.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'Live', draft: false },
  ),
  createProject(
    {
      slug: 'utility-belt',
      title: 'Utility Belt',
      description:
        'A tidy inventory for grapnels, spare batteries, and the gadget I swear I packed.',
      summary:
        'Utility Belt: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Inventory', 'Gadgets'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/utility-belt',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Gotham.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'In progress', draft: false },
  ),
  createProject(
    {
      slug: 'batmobile-log',
      title: 'Batmobile Log',
      description:
        'A maintenance journal that finally explains where the entire tire budget went.',
      summary:
        'Batmobile Log: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Transport', 'Logs'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/batmobile-log',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Gotham.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'Live', draft: false },
  ),
  createProject(
    {
      slug: 'wayne-foundation',
      title: 'Wayne Foundation',
      description:
        'A community project board for libraries, neighborhood repairs, and brighter streets.',
      summary:
        'Wayne Foundation: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Community', 'Planning'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/wayne-foundation',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Gotham.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'In progress', draft: false },
  ),
  createProject(
    {
      slug: 'casefile-index',
      title: 'Casefile Index',
      description:
        'A searchable notebook for clues, loose ends, and cases that needed one more cup of coffee.',
      summary:
        'Casefile Index: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Notes', 'Research'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/casefile-index',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Gotham.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'Live', draft: false },
  ),
  createProject(
    {
      slug: 'alfred-calendar',
      title: 'Alfred’s Calendar',
      description:
        'One calendar for board meetings, galas, and events I am already late for.',
      summary:
        'Alfred’s Calendar: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Scheduling', 'Wayne'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/alfred-calendar',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Wayne Manor.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'Planning', draft: false },
  ),
  createProject(
    {
      slug: 'quiet-mode',
      title: 'Batmobile Quiet Mode',
      description:
        'An experimental setting for arriving home without waking the entire manor.',
      summary:
        'Batmobile Quiet Mode: a fictional Wayne Enterprises side project from Bruce’s double life.',
      tags: ['Prototype', 'Gadgets'],
      techStack: ['TypeScript', 'Astro'],
      actions: [
        externalAction(
          'https://example.org/projects/quiet-mode',
          'Explore the concept',
        ),
      ],
      highlights: [
        'Built for the everyday problems of Gotham.',
        'Designed to work between a board meeting and the next patrol.',
        'Fictional project for the Batcave demo; no actual cave access required.',
      ],
    },
    { status: 'Planning', draft: true },
  ),
];

export function getVisibleProjects(projects: Project[] = PROJECTS) {
  return projects.filter(
    (project) => !project.draft || shouldShowDraftContent(),
  );
}

export function getProjectPath(project: Project): string {
  return `/projects/${project.slug}`;
}
