export type ThemeName =
  | 'dark-theme'
  | 'teal-purple'
  | 'orange-blue'
  | 'aqua-indigo'
  | 'light-clean'
  | 'light-violet'
  | 'light-slate'
  | 'light-parchment';

export interface ThemeColors {
  signatureGradient: string;
  firstWordColor: string;
  firstWordGlow: string;
  secondWordColor: string;
  secondWordGlow: string;
  accentColor: string;
  accentHover: string;
  accentGlow: string;
  bgGradient1: string;
  bgGradient2: string;
  bgGradient3: string;
  bgGradient4: string;
  patternColor: string;
  textColor: string;
  shadowColor: string;
  glassBg: string;
  cursorColor: string;
}

export const THEME_STORAGE_KEY = 'preferred-theme';
export const THEME_SWITCHER_ICONS = {
  open: 'fa-palette',
  close: 'fa-xmark',
} as const;
export const LIGHT_THEME_PREFIX = 'light-';

export function isLightTheme(themeName: string): boolean {
  return themeName.startsWith(LIGHT_THEME_PREFIX);
}

export const THEME_CSS_VARIABLES: Record<keyof ThemeColors, `--${string}`> = {
  signatureGradient: '--signature-gradient',
  firstWordColor: '--first-word-color',
  firstWordGlow: '--first-word-glow',
  secondWordColor: '--second-word-color',
  secondWordGlow: '--second-word-glow',
  accentColor: '--accent-color',
  accentHover: '--accent-hover',
  accentGlow: '--accent-glow',
  bgGradient1: '--bg-gradient-1',
  bgGradient2: '--bg-gradient-2',
  bgGradient3: '--bg-gradient-3',
  bgGradient4: '--bg-gradient-4',
  patternColor: '--pattern-color',
  textColor: '--text-color',
  shadowColor: '--shadow-color',
  glassBg: '--glass-bg',
  cursorColor: '--cursor-color',
};

export const THEMES: Record<ThemeName, ThemeColors> = {
  /* ── Dark themes ── */
  'dark-theme': {
    signatureGradient:
      'linear-gradient(105deg, #c5c9d1 0%, #f3f4f6 50%, #b0b8c5 100%)',
    firstWordColor: '#f5f5f5',
    firstWordGlow: 'rgba(245, 245, 245, 0.5)',
    secondWordColor: '#9e9e9e',
    secondWordGlow: 'rgba(158, 158, 158, 0.5)',
    accentColor: '#616161',
    accentHover: '#bdbdbd',
    accentGlow: 'rgba(97, 97, 97, 0.5)',
    bgGradient1: '#000000',
    bgGradient2: '#121212',
    bgGradient3: '#212121',
    bgGradient4: '#0a0a0a',
    patternColor: '#333',
    textColor: '#f5f5f5',
    shadowColor: '#000000',
    glassBg: 'rgba(33, 33, 33, 0.4)',
    cursorColor: 'rgba(158, 158, 158, 0.5)',
  },
  'teal-purple': {
    signatureGradient:
      'linear-gradient(105deg, #bd9cda 0%, #e5c0ef 50%, #b7a5e6 100%)',
    firstWordColor: '#00bcd4',
    firstWordGlow: 'rgba(0, 188, 212, 0.7)',
    secondWordColor: '#9c27b0',
    secondWordGlow: 'rgba(156, 39, 176, 0.7)',
    accentColor: '#9c27b0',
    accentHover: '#ba68c8',
    accentGlow: 'rgba(156, 39, 176, 0.5)',
    bgGradient1: '#13111c',
    bgGradient2: '#2e1e3b',
    bgGradient3: '#4a1e6a',
    bgGradient4: '#1f0f2f',
    patternColor: '#404',
    textColor: '#f6f6f6',
    shadowColor: '#13111c',
    glassBg: 'rgba(30, 20, 40, 0.3)',
    cursorColor: 'rgba(156, 39, 176, 0.4)',
  },
  'orange-blue': {
    signatureGradient:
      'linear-gradient(105deg, #a5b7ec 0%, #d4ddff 50%, #a3b5ef 100%)',
    firstWordColor: '#ff5722',
    firstWordGlow: 'rgba(255, 87, 34, 0.7)',
    secondWordColor: '#3f51b5',
    secondWordGlow: 'rgba(63, 81, 181, 0.7)',
    accentColor: '#3f51b5',
    accentHover: '#7986cb',
    accentGlow: 'rgba(63, 81, 181, 0.5)',
    bgGradient1: '#0e1021',
    bgGradient2: '#1a1f45',
    bgGradient3: '#242f6c',
    bgGradient4: '#0c112b',
    patternColor: '#334',
    textColor: '#f6f6f6',
    shadowColor: '#0e1021',
    glassBg: 'rgba(24, 29, 60, 0.3)',
    cursorColor: 'rgba(63, 81, 181, 0.4)',
  },
  'aqua-indigo': {
    signatureGradient:
      'linear-gradient(105deg, #87d5de 0%, #baeaf0 50%, #9fbfea 100%)',
    firstWordColor: '#18ffff',
    firstWordGlow: 'rgba(24, 255, 255, 0.7)',
    secondWordColor: '#82b1ff',
    secondWordGlow: 'rgba(130, 177, 255, 0.7)',
    accentColor: '#82b1ff',
    accentHover: '#b6e3ff',
    accentGlow: 'rgba(130, 177, 255, 0.5)',
    bgGradient1: '#091114',
    bgGradient2: '#0e2830',
    bgGradient3: '#193e47',
    bgGradient4: '#071619',
    patternColor: '#066',
    textColor: '#ffffff',
    shadowColor: '#091114',
    glassBg: 'rgba(14, 40, 48, 0.3)',
    cursorColor: 'rgba(24, 255, 255, 0.4)',
  },

  /* ── Light themes ── */
  'light-clean': {
    signatureGradient:
      'linear-gradient(105deg, #334155 0%, #536c83 50%, #3b556d 100%)',
    firstWordColor: '#1a1a2e',
    firstWordGlow: 'rgba(26, 26, 46, 0.15)',
    secondWordColor: '#4a5568',
    secondWordGlow: 'rgba(74, 85, 104, 0.15)',
    accentColor: '#94a3b8',
    accentHover: '#334155',
    accentGlow: 'rgba(148, 163, 184, 0.4)',
    bgGradient1: '#f8f9fa',
    bgGradient2: '#ffffff',
    bgGradient3: '#f0f2f5',
    bgGradient4: '#fafbfc',
    patternColor: '#c8cdd6',
    textColor: '#1e293b',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    glassBg: 'rgba(255, 255, 255, 0.72)',
    cursorColor: 'rgba(148, 163, 184, 0.5)',
  },
  'light-violet': {
    signatureGradient:
      'linear-gradient(105deg, #59358c 0%, #8655b1 50%, #694294 100%)',
    firstWordColor: '#2d1b69',
    firstWordGlow: 'rgba(45, 27, 105, 0.2)',
    secondWordColor: '#6d28d9',
    secondWordGlow: 'rgba(109, 40, 217, 0.2)',
    accentColor: '#7c3aed',
    accentHover: '#4c1d95',
    accentGlow: 'rgba(124, 58, 237, 0.3)',
    bgGradient1: '#faf8ff',
    bgGradient2: '#f5f0ff',
    bgGradient3: '#ede9fe',
    bgGradient4: '#fdfcff',
    patternColor: '#c4b5fd',
    textColor: '#1e1040',
    shadowColor: 'rgba(109, 40, 217, 0.08)',
    glassBg: 'rgba(255, 255, 255, 0.68)',
    cursorColor: 'rgba(124, 58, 237, 0.4)',
  },
  'light-slate': {
    signatureGradient:
      'linear-gradient(105deg, #264c82 0%, #3a70a5 50%, #2d578c 100%)',
    firstWordColor: '#0f172a',
    firstWordGlow: 'rgba(15, 23, 42, 0.15)',
    secondWordColor: '#1d4ed8',
    secondWordGlow: 'rgba(29, 78, 216, 0.2)',
    accentColor: '#3b82f6',
    accentHover: '#1e40af',
    accentGlow: 'rgba(59, 130, 246, 0.3)',
    bgGradient1: '#f0f8ff',
    bgGradient2: '#e8f4fd',
    bgGradient3: '#dbeafe',
    bgGradient4: '#f8fbff',
    patternColor: '#93c5fd',
    textColor: '#0f172a',
    shadowColor: 'rgba(59, 130, 246, 0.08)',
    glassBg: 'rgba(255, 255, 255, 0.68)',
    cursorColor: 'rgba(59, 130, 246, 0.4)',
  },

  /* Warm parchment: inspired by unix.foo's off-white light palette */
  'light-parchment': {
    signatureGradient:
      'linear-gradient(105deg, #8b3b29 0%, #b15b3e 50%, #94503a 100%)',
    firstWordColor: '#c4361b',
    firstWordGlow: 'rgba(196, 54, 27, 0.2)',
    secondWordColor: '#6f6c64',
    secondWordGlow: 'rgba(111, 108, 100, 0.15)',
    accentColor: '#c4361b',
    accentHover: '#8a2410',
    accentGlow: 'rgba(196, 54, 27, 0.25)',
    bgGradient1: '#f6f4ec',
    bgGradient2: '#efece1',
    bgGradient3: '#ece8db',
    bgGradient4: '#f8f6ef',
    patternColor: '#b9b5a8',
    textColor: '#14130f',
    shadowColor: 'rgba(20, 19, 15, 0.08)',
    glassBg: 'rgba(239, 236, 225, 0.85)',
    cursorColor: 'rgba(196, 54, 27, 0.35)',
  },
};

export const DEFAULT_THEME: ThemeName = 'dark-theme';

export interface ThemeOption {
  name: ThemeName;
  gradient: string;
  label: string;
}

export const DARK_THEMES: ThemeOption[] = [
  {
    name: 'dark-theme',
    gradient: 'linear-gradient(135deg, #212121, #424242)',
    label: 'Dark',
  },
  {
    name: 'teal-purple',
    gradient: 'linear-gradient(135deg, #00bcd4, #9c27b0)',
    label: 'Teal & Purple',
  },
  {
    name: 'orange-blue',
    gradient: 'linear-gradient(135deg, #ff5722, #3f51b5)',
    label: 'Orange & Blue',
  },
  {
    name: 'aqua-indigo',
    gradient: 'linear-gradient(135deg, #18ffff, #536dfe)',
    label: 'Aqua & Indigo',
  },
];

export const LIGHT_THEMES: ThemeOption[] = [
  {
    name: 'light-clean',
    gradient: 'linear-gradient(135deg, #e2e8f0, #ffffff)',
    label: 'Light Clean',
  },
  {
    name: 'light-violet',
    gradient: 'linear-gradient(135deg, #ede9fe, #7c3aed)',
    label: 'Light Violet',
  },
  {
    name: 'light-slate',
    gradient: 'linear-gradient(135deg, #dbeafe, #3b82f6)',
    label: 'Light Slate',
  },
  {
    name: 'light-parchment',
    gradient: 'linear-gradient(135deg, #f6f4ec, #c4361b)',
    label: 'Parchment',
  },
];
