export const THEME_STORAGE_KEY = 'helpieee-theme';
export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';
export const THEME_CHANGE_EVENT = 'helpieee-theme-change';

const serializedStorageKey = JSON.stringify(THEME_STORAGE_KEY);
const serializedDarkTheme = JSON.stringify(DARK_THEME);
const serializedLightTheme = JSON.stringify(LIGHT_THEME);

export const INITIAL_THEME_SCRIPT = `(function(){var theme;try{theme=window.localStorage.getItem(${serializedStorageKey});}catch(error){}if(theme!==${serializedDarkTheme}&&theme!==${serializedLightTheme}){theme=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?${serializedDarkTheme}:${serializedLightTheme};}var root=document.documentElement;root.setAttribute('data-theme',theme);root.style.colorScheme=theme;}());`;
