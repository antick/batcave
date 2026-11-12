import { afterEach, describe, expect, test } from 'bun:test';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '../apps/web/src/lib/themes';
import {
  getManualThemePreference,
  saveManualThemePreference,
} from '../apps/web/src/lib/themeUtils';

const originalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  'localStorage',
);

afterEach(() => {
  if (originalStorage) {
    Object.defineProperty(globalThis, 'localStorage', originalStorage);
  } else {
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

describe('theme preferences', () => {
  test('defaults to Dark and restores the last valid selection', () => {
    const values = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
    expect(DEFAULT_THEME).toBe('dark-theme');
    expect(getManualThemePreference() ?? DEFAULT_THEME).toBe('dark-theme');
    saveManualThemePreference('orange-blue');
    expect(getManualThemePreference()).toBe('orange-blue');
    saveManualThemePreference('light-violet');
    expect(getManualThemePreference()).toBe('light-violet');
    saveManualThemePreference('light-parchment');
    expect(getManualThemePreference()).toBe('light-parchment');
    for (const invalid of ['removed-theme', 'constructor', '__proto__']) {
      values.set(THEME_STORAGE_KEY, invalid);
      expect(getManualThemePreference() ?? DEFAULT_THEME).toBe('dark-theme');
    }
  });

  test('handles browsers that block storage without breaking the picker', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('Storage is blocked');
      },
    });
    expect(getManualThemePreference() ?? DEFAULT_THEME).toBe('dark-theme');
    expect(() => saveManualThemePreference('dark-theme')).not.toThrow();
  });
});
