(() => {
  const storageKey = 'helpieee-theme';
  const themeRoot = document.documentElement;
  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let manualTheme = null;

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      manualTheme = savedTheme;
    }
  } catch (error) {
    manualTheme = null;
  }

  const getSystemTheme = () => (mediaQuery && mediaQuery.matches ? 'dark' : 'light');
  const getActiveTheme = () => manualTheme || getSystemTheme();

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

  function persistTheme(theme) {
    manualTheme = theme;

    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore storage failures and keep the theme in-memory.
    }

    applyTheme(theme);
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

    document.body.appendChild(button);
    updateToggle(getActiveTheme());
  }

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
