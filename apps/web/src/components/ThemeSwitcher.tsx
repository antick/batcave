import { useState, useEffect, useRef } from 'react';
import {
  THEMES,
  DEFAULT_THEME,
  DARK_THEMES,
  LIGHT_THEMES,
  THEME_SWITCHER_ICONS,
  type ThemeName,
} from '../lib/themes';
import {
  applyThemeToDom,
  getManualThemePreference,
  saveManualThemePreference,
} from '../lib/themeUtils';

interface ThemeSwitcherProps {
  /** When true, renders inline inside the nav bar (panel opens downward) */
  inline?: boolean;
}

export default function ThemeSwitcher({ inline = false }: ThemeSwitcherProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeName>(() => {
    if (typeof document === 'undefined') return DEFAULT_THEME;
    const preloadedTheme = document.documentElement.dataset.theme as
      | ThemeName
      | undefined;
    return preloadedTheme && THEMES[preloadedTheme]
      ? preloadedTheme
      : DEFAULT_THEME;
  });
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTheme(getManualThemePreference() ?? DEFAULT_THEME);
  }, []);

  // Apply theme changes; persistence happens only after a manual selection.
  useEffect(() => {
    applyThemeToDom(THEMES[activeTheme], activeTheme);
  }, [activeTheme]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleSelect = (name: ThemeName) => {
    saveManualThemePreference(name);
    setActiveTheme(name);
    setIsOpen(false);
  };

  const panel = isOpen ? (
    <div className="color-switcher" role="dialog" aria-label="Choose a theme">
      <span className="color-switcher-label" title="Dark themes">
        <i className="fa-solid fa-moon" />
      </span>
      {DARK_THEMES.map(({ name, gradient, label }) => (
        <button
          type="button"
          key={name}
          className={`color-option${activeTheme === name ? ' active' : ''}`}
          style={{ background: gradient }}
          onClick={() => handleSelect(name)}
          title={label}
          aria-label={label}
          aria-pressed={activeTheme === name}
        />
      ))}
      <div className="color-switcher-divider" />
      <span className="color-switcher-label" title="Light themes">
        <i className="fa-solid fa-sun" />
      </span>
      {LIGHT_THEMES.map(({ name, gradient, label }) => (
        <button
          type="button"
          key={name}
          className={`color-option${activeTheme === name ? ' active' : ''}`}
          style={{ background: gradient }}
          onClick={() => handleSelect(name)}
          title={label}
          aria-label={label}
          aria-pressed={activeTheme === name}
        />
      ))}
    </div>
  ) : null;

  const toggleBtn = (
    <button
      type="button"
      className={`theme-toggle-btn${isOpen ? ' open' : ''}`}
      onClick={() => setIsOpen((prev) => !prev)}
      aria-label={isOpen ? 'Close theme switcher' : 'Open theme switcher'}
      aria-expanded={isOpen}
    >
      <i
        className={`fa-solid ${isOpen ? THEME_SWITCHER_ICONS.close : THEME_SWITCHER_ICONS.open}`}
      />
    </button>
  );

  return (
    <div
      className={`theme-switcher-wrap${inline ? ' inline' : ''}`}
      ref={wrapRef}
    >
      {/* Fixed/standalone: panel above button. Inline/nav: button first, panel below. */}
      {!inline && panel}
      {toggleBtn}
      {inline && panel}
    </div>
  );
}
