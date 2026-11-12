import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { SITE_URL } from './src/lib/constants';
import { headingIds } from './src/lib/headingIds';

const DEV_HOST_ENV = 'DEV_HOST';

function getDevHost() {
  const fromProcess = process.env[DEV_HOST_ENV]?.trim();
  if (fromProcess) {
    return fromProcess;
  }

  const envPath = join(dirname(fileURLToPath(import.meta.url)), '.env');
  if (!existsSync(envPath)) {
    return undefined;
  }

  const prefix = `${DEV_HOST_ENV}=`;
  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .map((entry) => entry.trim())
    .find(
      (entry) => entry && !entry.startsWith('#') && entry.startsWith(prefix),
    );
  const value = line?.slice(prefix.length).trim();
  return value?.replace(/^["']|["']$/g, '') || undefined;
}

const devHost = getDevHost();

export default defineConfig({
  site: SITE_URL,
  compressHTML: true,
  integrations: [react()],
  markdown: {
    processor: satteri({ hastPlugins: [headingIds] }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  ...(devHost
    ? {
        server: {
          host: devHost,
          allowedHosts: true,
        },
      }
    : {}),
});
