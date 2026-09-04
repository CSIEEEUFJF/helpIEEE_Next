'use client';

import { useEffect, useSyncExternalStore } from 'react';
import {
  DARK_THEME,
  LIGHT_THEME,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
} from '@/lib/theme';

let inMemoryTheme = null;

function getPreferredTheme() {
  let savedTheme;

  try {
    savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    savedTheme = null;
  }

  if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
    return savedTheme;
  }

  if (inMemoryTheme === DARK_THEME || inMemoryTheme === LIGHT_THEME) {
    return inMemoryTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? DARK_THEME
    : LIGHT_THEME;
}

function applyTheme(theme) {
  const root = document.documentElement;

  if (root.dataset.theme !== theme) root.dataset.theme = theme;
  if (root.style.colorScheme !== theme) root.style.colorScheme = theme;
}

function subscribeToTheme(callback) {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function handleSystemPreference() {
    try {
      if (!window.localStorage.getItem(THEME_STORAGE_KEY) && !inMemoryTheme) {
        callback();
      }
    } catch {
      if (!inMemoryTheme) callback();
    }
  }

  function handleStorage(event) {
    if (event.key === THEME_STORAGE_KEY) {
      inMemoryTheme = null;
      callback();
    }
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

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      inMemoryTheme = null;
    } catch {
      inMemoryTheme = nextTheme;
    }

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
