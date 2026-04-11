(() => {
  const storageKey = 'helpieee-theme';
  const paletteStorageKey = 'helpieee-palette';
  // Fallback rapido: troque para 'legacy' se quiser restaurar a paleta antiga sem desfazer CSS.
  const defaultPalette = 'enhanced';
  const themeRoot = document.documentElement;
  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let manualTheme = null;
  let manualPalette = null;

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      manualTheme = savedTheme;
    }

    const savedPalette = localStorage.getItem(paletteStorageKey);
    if (savedPalette === 'legacy' || savedPalette === 'enhanced') {
      manualPalette = savedPalette;
    }
  } catch (error) {
    manualTheme = null;
    manualPalette = null;
  }

  const getSystemTheme = () => (mediaQuery && mediaQuery.matches ? 'dark' : 'light');
  const getActiveTheme = () => manualTheme || getSystemTheme();
  const getActivePalette = () => manualPalette || defaultPalette;

  function updateToggle(theme) {
    const toggle = document.querySelector('[data-theme-toggle]');

    if (!toggle) {
      return;
    }

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const label = toggle.querySelector('.theme-toggle__label');

    toggle.dataset.themeCurrent = theme;
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.setAttribute('aria-label', `Alternar para tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`);
    toggle.setAttribute('title', `Trocar para tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`);

    if (label) {
      label.textContent = theme === 'dark' ? 'Tema escuro' : 'Tema claro';
    }
  }

  function applyTheme(theme) {
    themeRoot.dataset.theme = theme;
    themeRoot.style.colorScheme = theme;
    updateToggle(theme);
  }

  function applyPalette(palette) {
    themeRoot.dataset.palette = palette;
  }

  function persistTheme(theme) {
    manualTheme = theme;

    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore storage failures and keep the theme in-memory.
    }

    applyTheme(theme);
  }

  function persistPalette(palette) {
    manualPalette = palette;

    try {
      localStorage.setItem(paletteStorageKey, palette);
    } catch (error) {
      // Ignore storage failures and keep the palette in-memory.
    }

    applyPalette(palette);
  }

  function mountToggle() {
    if (!document.body || document.querySelector('[data-theme-toggle]')) {
      updateToggle(getActiveTheme());
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.dataset.themeToggle = '';
    button.innerHTML = `
      <span class="theme-toggle__icon" aria-hidden="true"></span>
      <span class="theme-toggle__label"></span>
    `;

    button.addEventListener('click', () => {
      const currentTheme = themeRoot.dataset.theme === 'dark' ? 'dark' : 'light';
      persistTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    const navContainer = document.querySelector('.topbar-nav, .nav-links');

    if (navContainer?.tagName === 'UL') {
      const wrapper = document.createElement('li');
      wrapper.className = 'nav-theme-item';
      wrapper.appendChild(button);
      navContainer.appendChild(wrapper);
    } else if (navContainer) {
      navContainer.appendChild(button);
    } else {
      document.body.appendChild(button);
    }

    updateToggle(getActiveTheme());
  }

  window.HELPIEEE_PALETTE = Object.freeze({
    useEnhanced() {
      persistPalette('enhanced');
    },
    useLegacy() {
      persistPalette('legacy');
    },
    reset() {
      manualPalette = null;

      try {
        localStorage.removeItem(paletteStorageKey);
      } catch (error) {
        // Ignore storage failures and fall back to the default palette in-memory.
      }

      applyPalette(getActivePalette());
    }
  });

  applyPalette(getActivePalette());
  applyTheme(getActiveTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountToggle, { once: true });
  } else {
    mountToggle();
  }

  if (mediaQuery) {
    const handleSystemThemeChange = (event) => {
      if (!manualTheme) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
})();
