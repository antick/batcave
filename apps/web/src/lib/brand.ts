import { isLightTheme } from './themes';

export const BRAND_LOGOS = {
  light: '/batcave-logo-light.svg',
  dark: '/batcave-logo-dark.svg',
} as const;

export const SITE_FAVICON_ID = 'site-favicon';

export function getBrandLogo(themeName: string): string {
  return isLightTheme(themeName) ? BRAND_LOGOS.light : BRAND_LOGOS.dark;
}
