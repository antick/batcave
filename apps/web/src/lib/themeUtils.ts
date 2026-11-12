import {
  THEMES,
  THEME_CSS_VARIABLES,
  THEME_STORAGE_KEY,
  type ThemeColors,
  type ThemeName,
} from './themes';
import { getBrandLogo, SITE_FAVICON_ID } from './brand';

export function getManualThemePreference(): ThemeName | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    return stored && Object.hasOwn(THEMES, stored) ? stored : null;
  } catch {
    return null;
  }
}

export function saveManualThemePreference(themeName: ThemeName): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch {}
}

export function applyThemeToDom(colors: ThemeColors, themeName: string): void {
  const root = document.documentElement;
  // Tag html element so CSS selectors can target the active theme group
  root.dataset.theme = themeName;
  Object.entries(THEME_CSS_VARIABLES).forEach(([colorKey, cssVariable]) => {
    root.style.setProperty(cssVariable, colors[colorKey as keyof ThemeColors]);
  });

  updateFavicon(themeName);
  updateSVGBackgrounds(colors);
}

function updateFavicon(themeName: string): void {
  const favicon = document.getElementById(
    SITE_FAVICON_ID,
  ) as HTMLLinkElement | null;
  if (favicon) favicon.href = getBrandLogo(themeName);
}

function updateSVGBackgrounds(colors: ThemeColors): void {
  const enc = encodeURIComponent;

  const titleShuriken = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='${enc(colors.accentColor)}' opacity='0.7'%3E%3Cpath d='M12,0 L15,9 L24,12 L15,15 L12,24 L9,15 L0,12 L9,9 L12,0 Z'%3E%3C/path%3E%3C/svg%3E")`;

  const backgroundPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='${enc(colors.patternColor)}' stroke-opacity='0.1' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3C/svg%3E")`;

  const layer1Shurikens = `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${enc(colors.accentColor)}' opacity='0.3'%3E%3Cpath d='M12,2 L16,12 L12,22 L8,12 L12,2 Z M2,12 L12,8 L22,12 L12,16 L2,12 Z'%3E%3C/path%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='${enc(colors.accentHover)}' opacity='0.2'%3E%3Cpath d='M12,0 L15,9 L24,12 L15,15 L12,24 L9,15 L0,12 L9,9 L12,0 Z'%3E%3C/path%3E%3C/svg%3E")
  `;

  const layer2Shurikens = `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='${enc(colors.accentColor)}' opacity='0.2'%3E%3Cpath d='M12,2 L16,12 L12,22 L8,12 L12,2 Z M2,12 L12,8 L22,12 L12,16 L2,12 Z'%3E%3C/path%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='%23ffffff' opacity='0.15'%3E%3Cpath d='M12,0 L15,9 L24,12 L15,15 L12,24 L9,15 L0,12 L9,9 L12,0 Z'%3E%3C/path%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='${enc(colors.accentHover)}' opacity='0.25'%3E%3Cpath d='M12,0 L15,9 L24,12 L15,15 L12,24 L9,15 L0,12 L9,9 L12,0 Z'%3E%3C/path%3E%3C/svg%3E")
  `;

  const styleTag =
    (document.getElementById('dynamic-styles') as HTMLStyleElement | null) ??
    document.createElement('style');
  styleTag.id = 'dynamic-styles';

  styleTag.innerHTML = `
    body::before {
      background: ${backgroundPattern};
    }
    .wrapper::before {
      background-image: ${layer1Shurikens};
    }
    .wrapper::after {
      background-image: ${layer2Shurikens};
    }
    .name::before {
      background-image: ${titleShuriken};
    }
  `;

  if (!document.getElementById('dynamic-styles')) {
    document.head.appendChild(styleTag);
  }
}
