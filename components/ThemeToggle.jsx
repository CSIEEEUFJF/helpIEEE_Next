'use client';

import { useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'helpieee-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
const THEME_CHANGE_EVENT = 'helpieee-theme-change';

function getPreferredTheme() {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? DARK_THEME
    : LIGHT_THEME;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function subscribeToTheme(callback) {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function handleSystemPreference() {
    if (!window.localStorage.getItem(STORAGE_KEY)) callback();
  }

  function handleStorage(event) {
    if (event.key === STORAGE_KEY) callback();
  }

  colorScheme.addEventListener('change', handleSystemPreference);
  window.addEventListener('storage', handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    colorScheme.removeEventListener('change', handleSystemPreference);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getServerTheme() {
  return LIGHT_THEME;
}

export function ThemeToggle({ className = '' }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getPreferredTheme,
    getServerTheme,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const isDark = theme === DARK_THEME;
  const accessibleLabel = `Ativar tema ${isDark ? 'claro' : 'escuro'}`;

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      type="button"
      onClick={toggleTheme}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? '☀' : '☾'}
      </span>
      <span className="theme-toggle__label">
        {isDark ? 'Tema claro' : 'Tema escuro'}
      </span>
    </button>
  );
}
