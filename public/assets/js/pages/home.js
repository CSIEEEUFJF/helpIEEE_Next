const homeIntro = document.getElementById('home-intro');
const rootElement = document.documentElement;

if (homeIntro && rootElement.classList.contains('has-home-intro')) {
  let introClosed = false;
  const introDelay = window.matchMedia('(max-width: 640px)').matches ? 1350 : 1900;

  const closeHomeIntro = () => {
    if (introClosed) {
      return;
    }

    introClosed = true;
    rootElement.classList.add('home-intro-leaving');

    window.setTimeout(() => {
      try {
        window.sessionStorage.setItem('helpieee-home-intro-seen', 'true');
      } catch (error) {
        // Ignore storage failures and keep the intro behavior in-memory only.
      }

      rootElement.classList.remove('has-home-intro', 'home-intro-leaving');
      homeIntro.remove();
    }, 620);
  };

  window.setTimeout(closeHomeIntro, introDelay);
  homeIntro.addEventListener('click', closeHomeIntro, { once: true });
}

const bodyElement = document.body;
const homeSidebar = document.getElementById('home-sidebar');
const homeSidebarToggle = document.getElementById('home-sidebar-toggle');
const homeSidebarBackdrop = document.getElementById('home-sidebar-backdrop');
const homeSidebarMobileTrigger = document.getElementById('home-sidebar-mobile-trigger');
const navSidebarTrigger = document.getElementById('nav-sidebar-trigger');
const heroSidebarTrigger = document.getElementById('hero-sidebar-trigger');
const compactSidebarQuery = window.matchMedia('(max-width: 1100px)');
const homeSidebarStorageKey = 'helpieee-site-sidebar-collapsed';
const legacyHomeSidebarStorageKey = 'helpieee-home-sidebar-collapsed';
const homeNavLinks = document.querySelector('.nav-links');
const homeNav = document.querySelector('nav');

let homeSidebarCollapsed = false;
let homeSidebarOpen = false;
const homeSidebarTooltipHideDelay = 120;
const homeSearchHighlightDuration = 1800;
let highlightedHomeSearchTarget = null;
let highlightedHomeSearchTimer = 0;

const homeRoutes = [
  { href: 'pages/sobre-nos.html', title: 'Sobre Nós', meta: 'Propósito, equipe e jeito de usar o HELPIEEE' },
  { href: 'pages/primeiros-passos.html', title: 'Primeiros Passos', meta: 'Internet, RU e laboratórios' },
  { href: 'pages/faculdade.html', title: 'Funcionamento da Faculdade', meta: 'SIGA, IRA, RAG e vida acadêmica' },
  { href: 'pages/materiais.html', title: 'Materiais do 1º período', meta: 'Disciplinas, guias de estudo e apoio' },
  { href: 'pages/comunidade.html', title: 'Comunidade', meta: 'Grupos, apoio e integração' },
  { href: 'pages/ieee.html', title: 'IEEE & Oportunidades', meta: 'Capítulos, equipes e oportunidades' },
  { href: 'pages/fluxo.html', title: 'Fluxo Curricular', meta: 'Pré-requisitos, grades e planejamento' },
];

function normalizeSearchValue(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' e ')
    .replace(/[º°]/g, ' o ')
    .replace(/ª/g, ' a ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const searchArabicToRomanMap = {
  '1': 'i',
  '2': 'ii',
  '3': 'iii',
  '4': 'iv',
  '5': 'v',
  '6': 'vi',
  '7': 'vii',
  '8': 'viii',
  '9': 'ix',
  '10': 'x',
};

const searchRomanToArabicMap = Object.fromEntries(
  Object.entries(searchArabicToRomanMap).map(([arabic, roman]) => [roman, arabic])
);

function compactSearchValue(value) {
  return normalizeSearchValue(value).replace(/\s+/g, '');
}

function remapSearchNumerals(value, replacements) {
  const normalized = normalizeSearchValue(value);

  if (!normalized) {
    return '';
  }

  return normalized
    .split(' ')
    .map((token) => replacements[token] || token)
    .join(' ');
}

function buildSearchVariants(value) {
  const normalized = normalizeSearchValue(value);

  if (!normalized) {
    return [];
  }

  const arabicVariant = remapSearchNumerals(normalized, searchRomanToArabicMap);
  const romanVariant = remapSearchNumerals(normalized, searchArabicToRomanMap);
  const variants = new Set([
    normalized,
    arabicVariant,
    romanVariant,
    compactSearchValue(normalized),
    compactSearchValue(arabicVariant),
    compactSearchValue(romanVariant),
  ]);

  return Array.from(variants).filter(Boolean);
}

function buildSearchHaystack(...values) {
  const variants = new Set();

  values.filter(Boolean).forEach((value) => {
    buildSearchVariants(value).forEach((variant) => variants.add(variant));
  });

  return Array.from(variants).join(' ');
}

function buildSearchQuery(rawValue) {
  const normalized = normalizeSearchValue(rawValue);

  return {
    normalized,
    compact: compactSearchValue(rawValue),
    tokens: normalized.split(' ').filter(Boolean),
    variants: buildSearchVariants(rawValue),
  };
}

function hasExactSearchVariant(entryVariants, queryVariants) {
  return queryVariants.some((variant) => entryVariants.includes(variant));
}

function hasStartsWithSearchVariant(entryVariants, queryVariants) {
  return queryVariants.some((variant) => variant && entryVariants.some((entryVariant) => entryVariant.startsWith(variant)));
}

function hasIncludesSearchVariant(entryValue, queryVariants) {
  return queryVariants.some((variant) => variant && entryValue.includes(variant));
}

function condenseText(value) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugifyValue(value) {
  return normalizeSearchValue(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureHomeSearchTargetId(element, fallback) {
  if (!element) {
    return '';
  }

  if (!element.id) {
    element.id = `home-search-${fallback}`;
  }

  return element.id;
}

function getHomeSearchSnippetPreview(text, queryTokens) {
  const plainText = condenseText(text);

  if (!plainText) {
    return '';
  }

  if (!queryTokens.length) {
    return plainText.slice(0, 150);
  }

  const normalizedText = normalizeSearchValue(plainText);
  const firstMatchIndex = queryTokens.reduce((bestIndex, token) => {
    const tokenIndex = normalizedText.indexOf(token);

    if (tokenIndex === -1) {
      return bestIndex;
    }

    return bestIndex === -1 ? tokenIndex : Math.min(bestIndex, tokenIndex);
  }, -1);

  if (firstMatchIndex === -1) {
    return plainText.slice(0, 150);
  }

  const previewStart = Math.max(0, firstMatchIndex - 38);
  const previewEnd = Math.min(plainText.length, previewStart + 164);
  const preview = plainText.slice(previewStart, previewEnd).trim();

  return `${previewStart > 0 ? '…' : ''}${preview}${previewEnd < plainText.length ? '…' : ''}`;
}

function scoreHomeSearchEntry(entry, query) {
  const { normalized, compact, tokens, variants } = query;

  if (!tokens.length) {
    return -1;
  }

  const matchesAllTokens = tokens.every((token) => entry.searchValue.includes(token));

  if (!matchesAllTokens) {
    return -1;
  }

  let score = 0;
  const exactNeedles = compact ? Array.from(new Set([...variants, compact])) : variants;

  if (hasExactSearchVariant(entry.titleVariants, exactNeedles)) {
    score += 320;
  } else if (hasStartsWithSearchVariant(entry.titleVariants, exactNeedles)) {
    score += 220;
  } else if (hasIncludesSearchVariant(entry.titleSearchValue, exactNeedles)) {
    score += 150;
  }

  if (hasIncludesSearchVariant(entry.metaSearchValue, exactNeedles) || (normalized && entry.metaValue.includes(normalized))) {
    score += 60;
  }

  if (hasIncludesSearchVariant(entry.textSearchValue, exactNeedles) || (normalized && entry.textValue.includes(normalized))) {
    score += 90;
  }

  if (entry.kind === 'section') {
    score += 28;
  } else if (entry.kind === 'page') {
    score += 20;
  }

  tokens.forEach((token) => {
    if (entry.titleSearchValue.startsWith(token) || entry.titleVariants.some((variant) => variant.startsWith(token))) {
      score += 40;
    } else if (entry.titleSearchValue.includes(token)) {
      score += 28;
    }

    if (entry.metaSearchValue.includes(token)) {
      score += 12;
    }

    if (entry.textSearchValue.includes(token)) {
      score += 10;
    }
  });

  return score;
}

function flashHomeSearchTarget(targetId) {
  if (!targetId) {
    return;
  }

  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  if (highlightedHomeSearchTarget && highlightedHomeSearchTarget !== target) {
    highlightedHomeSearchTarget.classList.remove('home-search-target-active');
  }

  window.clearTimeout(highlightedHomeSearchTimer);
  highlightedHomeSearchTarget = target;
  target.classList.add('home-search-target-active');
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  highlightedHomeSearchTimer = window.setTimeout(() => {
    target.classList.remove('home-search-target-active');

    if (highlightedHomeSearchTarget === target) {
      highlightedHomeSearchTarget = null;
    }
  }, homeSearchHighlightDuration);
}

function buildHomeSearchIndex() {
  const entries = [];
  const entryKeys = new Set();

  homeRoutes.forEach((route) => {
    const relatedTexts = Array.from(document.querySelectorAll(`a[href="${route.href}"]`))
      .map((link) => [link.getAttribute('aria-label'), link.getAttribute('title'), link.textContent].map(condenseText).filter(Boolean).join(' '))
      .filter(Boolean);

    const fullText = [route.title, route.meta, ...relatedTexts].join(' ');
    const entry = {
      kind: 'page',
      eyebrow: 'Página',
      title: route.title,
      meta: route.meta,
      snippet: relatedTexts[0] || route.meta,
      href: route.href,
      titleValue: normalizeSearchValue(route.title),
      titleVariants: buildSearchVariants(route.title),
      titleSearchValue: buildSearchHaystack(route.title),
      metaValue: normalizeSearchValue(route.meta),
      metaSearchValue: buildSearchHaystack(route.meta),
      textValue: normalizeSearchValue(fullText),
      textSearchValue: buildSearchHaystack(fullText),
      searchValue: buildSearchHaystack(fullText),
    };
    const entryKey = `${entry.kind}:${entry.href}`;

    if (!entryKeys.has(entryKey)) {
      entryKeys.add(entryKey);
      entries.push(entry);
    }
  });

  const homeSections = [
    { selector: '.hero', eyebrow: 'Homepage', meta: 'Abertura do HELPIEEE', targetElement: document.querySelector('.hero') },
    { selector: '#features', eyebrow: 'Nesta página', meta: 'O que você encontra no HELPIEEE', targetElement: document.getElementById('features') },
    { selector: '#fluxo', eyebrow: 'Nesta página', meta: 'Fluxo curricular interativo', targetElement: document.getElementById('fluxo') },
    { selector: '#ieee', eyebrow: 'Nesta página', meta: 'Projeto da Education Society Ramo IEEE UFJF', targetElement: document.getElementById('ieee') },
    { selector: '#start', eyebrow: 'Nesta página', meta: 'Chamada para começar', targetElement: document.getElementById('start') },
  ];

  homeSections.forEach((section, index) => {
    const element = section.targetElement || document.querySelector(section.selector);

    if (!element) {
      return;
    }

    const titleElement = element.querySelector('.hero-title, .section-title, .cta-title, h2, h3');
    const snippetElement = element.querySelector('.hero-sub, .section-desc, .cta-desc, .fluxo-note, p');
    const title = condenseText(titleElement?.textContent || section.meta);
    const snippet = condenseText(snippetElement?.textContent || element.textContent).slice(0, 190);
    const targetId = ensureHomeSearchTargetId(element, `${slugifyValue(title || section.meta) || 'item'}-${index + 1}`);
    const fullText = `${title} ${section.meta} ${snippet} ${condenseText(element.textContent)}`;
    const entry = {
      kind: 'section',
      eyebrow: section.eyebrow,
      title,
      meta: section.meta,
      snippet,
      targetId,
      titleValue: normalizeSearchValue(title),
      titleVariants: buildSearchVariants(title),
      titleSearchValue: buildSearchHaystack(title),
      metaValue: normalizeSearchValue(section.meta),
      metaSearchValue: buildSearchHaystack(section.meta),
      textValue: normalizeSearchValue(fullText),
      textSearchValue: buildSearchHaystack(fullText),
      searchValue: buildSearchHaystack(fullText),
    };
    const entryKey = `${entry.kind}:${entry.targetId}`;

    if (!entryKeys.has(entryKey)) {
      entryKeys.add(entryKey);
      entries.push(entry);
    }
  });

  return entries;
}

function mountHomeSearch() {
  if (!homeNav) {
    return;
  }

  const searchShell = document.createElement('div');
  searchShell.className = 'nav-search-shell';
  searchShell.innerHTML = `
    <div class="nav-search">
      <div class="nav-search__field">
        <span class="nav-search__icon" aria-hidden="true"></span>
        <input
          type="search"
          class="nav-search__input"
          id="home-search-input"
          placeholder="Buscar na home ou no HELPIEEE"
          autocomplete="off"
          spellcheck="false"
        >
        <button type="button" class="nav-search__clear" id="home-search-clear" hidden>Limpar</button>
      </div>
      <div class="nav-search-results" id="home-search-results" hidden></div>
    </div>
  `;

  if (homeNavLinks) {
    homeNav.insertBefore(searchShell, homeNavLinks);
  } else {
    homeNav.appendChild(searchShell);
  }

  const searchInput = searchShell.querySelector('.nav-search__input');
  const searchClear = searchShell.querySelector('.nav-search__clear');
  const searchResults = searchShell.querySelector('.nav-search-results');
  const searchIndex = buildHomeSearchIndex();
  let activeResults = [];
  let activeResultIndex = -1;

  const syncActiveResult = () => {
    searchResults.querySelectorAll('.nav-search-result[data-search-index]').forEach((button) => {
      const isActive = Number(button.dataset.searchIndex) === activeResultIndex;
      button.classList.toggle('is-active', isActive);

      if (isActive) {
        button.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  const setActiveResult = (nextIndex) => {
    if (!activeResults.length) {
      activeResultIndex = -1;
      return;
    }

    activeResultIndex = (nextIndex + activeResults.length) % activeResults.length;
    syncActiveResult();
  };

  const hideResults = () => {
    activeResults = [];
    activeResultIndex = -1;
    searchResults.hidden = true;
    searchResults.innerHTML = '';
  };

  const openResult = (resultIndex) => {
    const targetIndex = resultIndex >= 0 ? resultIndex : 0;
    const result = activeResults[targetIndex];

    if (!result) {
      return;
    }

    if (result.href) {
      window.location.href = result.href;
      return;
    }

    searchInput.value = result.title;
    searchClear.hidden = false;
    hideResults();
    flashHomeSearchTarget(result.targetId);
  };

  const renderResults = (rawQuery) => {
    const query = buildSearchQuery(rawQuery);
    const normalizedQuery = query.normalized;
    const queryTokens = query.tokens;

    searchClear.hidden = !normalizedQuery;

    if (!normalizedQuery) {
      hideResults();
      return;
    }

    activeResults = searchIndex
      .map((entry) => ({
        ...entry,
        score: scoreHomeSearchEntry(entry, query),
      }))
      .filter((entry) => entry.score >= 0)
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'pt-BR'))
      .slice(0, 8)
      .map((entry) => ({
        ...entry,
        preview: getHomeSearchSnippetPreview(entry.snippet || entry.meta, queryTokens),
      }));

    if (!activeResults.length) {
      activeResultIndex = -1;
      searchResults.hidden = false;
      searchResults.innerHTML = `
        <div class="nav-search-results__empty">
          Nenhum resultado encontrado. Tente outra palavra-chave.
        </div>
      `;
      return;
    }

    activeResultIndex = 0;
    searchResults.hidden = false;
    searchResults.innerHTML = activeResults.map((result, index) => `
      <button type="button" class="nav-search-result${index === activeResultIndex ? ' is-active' : ''}" data-search-index="${index}">
        <span class="nav-search-result__eyebrow">${escapeHtml(result.eyebrow)}</span>
        <span class="nav-search-result__title">${escapeHtml(result.title)}</span>
        <span class="nav-search-result__meta">${escapeHtml(result.meta)}</span>
        <span class="nav-search-result__snippet">${escapeHtml(result.preview)}</span>
      </button>
    `).join('');
  };

  searchInput.addEventListener('input', (event) => {
    renderResults(event.target.value);
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
      renderResults(searchInput.value);
    }
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResult(activeResultIndex < 0 ? 0 : activeResultIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult(activeResultIndex < 0 ? activeResults.length - 1 : activeResultIndex - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      openResult(activeResultIndex);
    } else if (event.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    hideResults();
    searchClear.hidden = true;
  });

  searchResults.addEventListener('mousemove', (event) => {
    const resultButton = event.target.closest('[data-search-index]');

    if (!resultButton) {
      return;
    }

    const nextIndex = Number(resultButton.dataset.searchIndex);

    if (nextIndex !== activeResultIndex) {
      activeResultIndex = nextIndex;
      syncActiveResult();
    }
  });

  searchResults.addEventListener('click', (event) => {
    const resultButton = event.target.closest('[data-search-index]');

    if (!resultButton) {
      return;
    }

    openResult(Number(resultButton.dataset.searchIndex));
  });

  document.addEventListener('click', (event) => {
    if (!searchShell.contains(event.target)) {
      hideResults();
    }
  });
}

function initHomeSidebarTooltips(sidebarRoot, compactSidebarMediaQuery) {
  if (!sidebarRoot || !bodyElement) {
    return () => {};
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'home-sidebar-tooltip';
  tooltip.hidden = true;
  tooltip.innerHTML = `
    <div class="home-sidebar-tooltip__title"></div>
    <div class="home-sidebar-tooltip__meta"></div>
  `;
  document.body.appendChild(tooltip);

  const tooltipTitle = tooltip.querySelector('.home-sidebar-tooltip__title');
  const tooltipMeta = tooltip.querySelector('.home-sidebar-tooltip__meta');
  let activeTarget = null;
  let hideTimer = 0;

  const shouldShowTooltip = () => bodyElement.classList.contains('sidebar-collapsed') && !compactSidebarMediaQuery.matches;

  const positionTooltip = (target) => {
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const top = Math.min(Math.max(rect.top + rect.height / 2, 24), window.innerHeight - 24);
    const maxLeft = Math.max(12, window.innerWidth - tooltip.offsetWidth - 12);
    const left = Math.min(rect.right + 16, maxLeft);

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  const hideTooltip = () => {
    activeTarget = null;
    window.clearTimeout(hideTimer);
    tooltip.classList.remove('is-visible');
    hideTimer = window.setTimeout(() => {
      tooltip.hidden = true;
    }, homeSidebarTooltipHideDelay);
  };

  const showTooltip = (target) => {
    if (!shouldShowTooltip()) {
      return;
    }

    const titleElement = target.querySelector('.home-sidebar__spotlight-title, .home-sidebar__link-title');
    const metaElement = target.querySelector('.home-sidebar__spotlight-desc, .home-sidebar__link-meta');

    activeTarget = target;
    window.clearTimeout(hideTimer);
    tooltipTitle.textContent = titleElement?.textContent?.trim() || target.getAttribute('title') || '';
    tooltipMeta.textContent = metaElement?.textContent?.trim() || '';
    tooltipMeta.hidden = !tooltipMeta.textContent;
    tooltip.hidden = false;
    positionTooltip(target);

    requestAnimationFrame(() => {
      tooltip.classList.add('is-visible');
    });
  };

  sidebarRoot.querySelectorAll('.home-sidebar__spotlight, .home-sidebar__link').forEach((link) => {
    link.addEventListener('mouseenter', () => showTooltip(link));
    link.addEventListener('mouseleave', hideTooltip);
    link.addEventListener('focus', () => showTooltip(link));
    link.addEventListener('blur', hideTooltip);
  });

  window.addEventListener('scroll', () => {
    if (activeTarget && shouldShowTooltip()) {
      positionTooltip(activeTarget);
    } else if (activeTarget) {
      hideTooltip();
    }
  }, true);

  window.addEventListener('resize', () => {
    if (activeTarget && shouldShowTooltip()) {
      positionTooltip(activeTarget);
    } else if (activeTarget) {
      hideTooltip();
    }
  });

  return () => {
    if (!shouldShowTooltip()) {
      hideTooltip();
    }
  };
}

if (homeSidebar) {
  const syncHomeSidebarTooltips = initHomeSidebarTooltips(homeSidebar, compactSidebarQuery);

  try {
    const savedSidebarState = window.localStorage.getItem(homeSidebarStorageKey);
    homeSidebarCollapsed = savedSidebarState
      ? savedSidebarState === 'true'
      : window.localStorage.getItem(legacyHomeSidebarStorageKey) === 'true';
  } catch (error) {
    homeSidebarCollapsed = false;
  }

  const syncHomeSidebar = () => {
    const isCompact = compactSidebarQuery.matches;

    bodyElement.classList.toggle('sidebar-collapsed', !isCompact && homeSidebarCollapsed);
    bodyElement.classList.toggle('sidebar-open', isCompact && homeSidebarOpen);

    homeSidebar.setAttribute('aria-hidden', String(isCompact && !homeSidebarOpen));

    if (homeSidebarToggle) {
      const expanded = isCompact ? homeSidebarOpen : !homeSidebarCollapsed;
      homeSidebarToggle.setAttribute('aria-expanded', String(expanded));
      homeSidebarToggle.setAttribute(
        'aria-label',
        isCompact
          ? (homeSidebarOpen ? 'Fechar atalhos' : 'Abrir atalhos')
          : (homeSidebarCollapsed ? 'Expandir atalhos' : 'Recolher atalhos'),
      );
    }

    if (homeSidebarMobileTrigger) {
      homeSidebarMobileTrigger.setAttribute('aria-expanded', String(isCompact && homeSidebarOpen));
    }

    if (homeSidebarBackdrop) {
      homeSidebarBackdrop.hidden = !(isCompact && homeSidebarOpen);
    }

    syncHomeSidebarTooltips();
  };

  const persistSidebarState = () => {
    try {
      window.localStorage.setItem(homeSidebarStorageKey, String(homeSidebarCollapsed));
    } catch (error) {
      // Ignore storage failures and keep only the in-memory state.
    }
  };

  const openHomeSidebar = () => {
    if (compactSidebarQuery.matches) {
      homeSidebarOpen = true;
    } else {
      homeSidebarCollapsed = false;
      persistSidebarState();
    }

    syncHomeSidebar();
  };

  const closeHomeSidebar = () => {
    if (!compactSidebarQuery.matches) {
      return;
    }

    homeSidebarOpen = false;
    syncHomeSidebar();
  };

  const toggleHomeSidebar = () => {
    if (compactSidebarQuery.matches) {
      homeSidebarOpen = !homeSidebarOpen;
    } else {
      homeSidebarCollapsed = !homeSidebarCollapsed;
      persistSidebarState();
    }

    syncHomeSidebar();
  };

  homeSidebarToggle?.addEventListener('click', toggleHomeSidebar);
  homeSidebarMobileTrigger?.addEventListener('click', toggleHomeSidebar);
  navSidebarTrigger?.addEventListener('click', openHomeSidebar);
  heroSidebarTrigger?.addEventListener('click', openHomeSidebar);
  homeSidebarBackdrop?.addEventListener('click', closeHomeSidebar);

  homeSidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (compactSidebarQuery.matches) {
        closeHomeSidebar();
      }
    });
  });

  if (typeof compactSidebarQuery.addEventListener === 'function') {
    compactSidebarQuery.addEventListener('change', () => {
      homeSidebarOpen = false;
      syncHomeSidebar();
    });
  } else if (typeof compactSidebarQuery.addListener === 'function') {
    compactSidebarQuery.addListener(() => {
      homeSidebarOpen = false;
      syncHomeSidebar();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && compactSidebarQuery.matches && homeSidebarOpen) {
      closeHomeSidebar();
    }
  });

  syncHomeSidebar();
}

mountHomeSearch();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 80);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

// Smooth nav
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function handleAnchorClick(event) {
    const href = this.getAttribute('href');

    if (!href || href === '#') {
      return;
    }

    const target = document.querySelector(href);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const fluxoNote = document.querySelector('.fluxo-note');

window.addEventListener('message', (event) => {
  const payload = event.data;

  if (!payload || payload.type !== 'helpieee-flow-change' || !fluxoNote) {
    return;
  }

  fluxoNote.textContent = `Grade ativa: ${payload.label} \u00b7 altere a op\u00e7\u00e3o dentro do fluxo para comparar as habilita\u00e7\u00f5es.`;
});
