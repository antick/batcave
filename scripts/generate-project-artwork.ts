import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { REPOSITORY_ROOT } from './quality-shared';
import { PROJECTS } from '../apps/web/src/lib/projects';
import { SITE_NAME } from '../apps/web/src/lib/constants';

interface ArtworkDefinition {
  slug: string;
  title: string;
  label: string;
  accent: string;
  motif: string;
}

const OUTPUT_DIRECTORY = path.join(
  REPOSITORY_ROOT,
  'apps/web/public/images/projects',
);
const ARTWORK_WIDTH = 1200;
const ARTWORK_HEIGHT = 675;

const ACCENTS = [
  '#3b82f6',
  '#f97316',
  '#d946ef',
  '#eab308',
  '#22c55e',
  '#8b5cf6',
  '#14b8a6',
  '#0ea5e9',
];
const MOTIFS = [
  '<rect x="475" y="220" width="250" height="250" rx="24" fill="none"/><path d="M535 285h130M535 335h130M535 385h90" fill="none"/>',
  '<circle cx="600" cy="340" r="120" fill="none"/><path d="M600 220v240M480 340h240" fill="none"/>',
  '<path d="m470 440 130-230 130 230Z" fill="none"/><path d="M535 325h130" fill="none"/>',
  '<rect x="470" y="230" width="260" height="220" rx="20" fill="none"/><path d="m470 400 75-85 65 65 60-100 60 120" fill="none"/>',
];
const ARTWORK: ArtworkDefinition[] = PROJECTS.map((project, index) => ({
  slug: project.slug,
  title: project.title,
  label: 'FICTIONAL PROJECT',
  accent: ACCENTS[index % ACCENTS.length],
  motif: MOTIFS[index % MOTIFS.length],
}));

const THEMES = {
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#172033',
    muted: '#64748b',
    grid: '#dbe3ef',
  },
  dark: {
    background: '#080b12',
    surface: '#111827',
    text: '#f8fafc',
    muted: '#94a3b8',
    grid: '#263144',
  },
} as const;

function renderArtwork(
  definition: ArtworkDefinition,
  themeName: keyof typeof THEMES,
): string {
  const theme = THEMES[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ARTWORK_WIDTH} ${ARTWORK_HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">${definition.title} project artwork</title>
  <desc id="desc">A distinct geometric illustration representing ${definition.label.toLowerCase()}.</desc>
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${definition.accent}"/>
      <stop offset="1" stop-color="${definition.accent}" stop-opacity=".38"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="${theme.grid}" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="675" rx="36" fill="${theme.background}"/>
  <rect x="24" y="24" width="1152" height="627" rx="28" fill="${theme.surface}" stroke="${theme.grid}" stroke-width="2"/>
  <rect x="24" y="24" width="1152" height="627" rx="28" fill="url(#grid)" opacity=".42"/>
  <circle cx="600" cy="340" r="235" fill="${definition.accent}" opacity=".08"/>
  <g fill="url(#accent)" stroke="${definition.accent}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round">${definition.motif}</g>
  <text x="72" y="92" fill="${definition.accent}" font-family="ui-monospace, monospace" font-size="22" font-weight="700" letter-spacing="4">${definition.label}</text>
  <text x="72" y="600" fill="${theme.text}" font-family="ui-sans-serif, sans-serif" font-size="58" font-weight="800">${definition.title}</text>
  <text x="1128" y="600" fill="${theme.muted}" font-family="ui-monospace, monospace" font-size="18" text-anchor="end">${SITE_NAME.toUpperCase()} / DEMO</text>
</svg>`;
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });

for (const definition of ARTWORK) {
  for (const themeName of Object.keys(THEMES) as Array<keyof typeof THEMES>) {
    const destination = path.join(
      OUTPUT_DIRECTORY,
      `${definition.slug}-${themeName}.svg`,
    );
    await Bun.write(destination, renderArtwork(definition, themeName));
  }
}

console.log(
  `Generated ${ARTWORK.length * 2} project artwork files in ${OUTPUT_DIRECTORY}.`,
);
