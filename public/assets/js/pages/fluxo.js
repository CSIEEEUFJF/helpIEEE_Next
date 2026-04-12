const rawCurricula = window.FLOW_CURRICULA || {};

function parsePrereqs(value) {
  return (value || '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function hydrateCurriculum(definition) {
  const periods = {};

  definition.periods.forEach((periodList, index) => {
    periods[index + 1] = periodList.map(([code, name, value, prereqString]) => ({
      code,
      name,
      value,
      prereqs: parsePrereqs(prereqString)
    }));
  });

  const discs = {};
  Object.entries(periods).forEach(([period, list]) => {
    list.forEach((disc) => {
      discs[disc.code] = { ...disc, period: Number(period) };
    });
  });

  const unlocks = {};
  Object.values(discs).forEach((disc) => {
    disc.prereqs.forEach((prereq) => {
      if (!discs[prereq]) {
        return;
      }

      if (!unlocks[prereq]) {
        unlocks[prereq] = [];
      }

      unlocks[prereq].push(disc.code);
    });
  });

  return {
    ...definition,
    periods,
    discs,
    unlocks,
    periodCount: definition.periods.length,
    totalDiscs: Object.keys(discs).length,
    totalValue: Object.values(discs).reduce((sum, disc) => sum + disc.value, 0)
  };
}

const curricula = Object.fromEntries(
  Object.entries(rawCurricula).map(([key, definition]) => [key, hydrateCurriculum(definition)])
);

const grid = document.getElementById('flow-grid');
const scrollHost = document.querySelector('.flow-scroll');
const stickyScrollbarShell = document.getElementById('flow-scrollbar-shell');
const stickyScrollbar = document.getElementById('flow-scrollbar');
const stickyScrollbarFill = document.getElementById('flow-scrollbar-fill');
const bottomBar = document.querySelector('.bottom-bar');
const bodyElement = document.body;
const flowUrlParams = new URLSearchParams(window.location.search);
const isHomeEmbed = flowUrlParams.get('embed') === 'home';
const infoBar = document.getElementById('info-bar');
const curriculumSelect = document.getElementById('curriculum-select');
const topbarNav = document.querySelector('.topbar-nav');
const searchHighlightDuration = 1800;
const pageSidebarStorageKey = 'helpieee-flow-sidebar-hidden';
const sidebarTooltipHideDelay = 120;
const discTooltipHoverQuery = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
const directFlowScrollQuery = window.matchMedia('(max-width: 900px), (pointer: coarse)');

const flowSidebarSpotlightRoute = {
  href: 'fluxo.html',
  label: 'Fluxo Curricular',
  meta: 'pré-requisitos, grades e visão de longo prazo do curso',
  icon: '../assets/icons/blueprint.svg',
  kicker: 'Mais acessado',
  cta: 'Abrir'
};

const flowPrimaryRoutes = [
  { href: 'primeiros-passos.html', label: 'Primeiros Passos', meta: 'internet, RU, laboratórios e começo do semestre', icon: '../assets/icons/document.svg' },
  { href: 'faculdade.html', label: 'Funcionamento da Faculdade', meta: 'SIGA, IRA, RAG, glossário e regras da vida acadêmica', icon: '../assets/icons/faculty.svg' },
  { href: 'fluxo.html', label: 'Fluxo Curricular', meta: 'pré-requisitos, grades e visão de longo prazo do curso', icon: '../assets/icons/blueprint.svg', current: true }
];

const flowSecondaryRoutes = [
  { href: 'comunidade.html', label: 'Comunidade', meta: 'apoio, grupos, monitoria e rotina com outras pessoas', icon: '../assets/icons/community.svg' },
  { href: 'ieee.html', label: 'IEEE & Oportunidades', meta: 'capítulos, equipes, eventos e portas de entrada', icon: '../assets/icons/circuit.svg' },
  { href: 'sobre-nos.html', label: 'Sobre Nós', meta: 'propósito, projeto e jeito de usar o HELPIEEE', icon: '../assets/icons/engineering.svg' }
];

let activeCurriculumKey = curriculumSelect?.value || Object.keys(curricula)[0];
let activeCurriculum = curricula[activeCurriculumKey];
let selectedCode = null;
let showArrows = true;
let mode = 'navigate';
let doneSet = new Set();
let rafId;
let syncingStickyScrollbar = false;
let highlightedSearchDisc = null;
let highlightedSearchTimer = 0;

if (topbarNav) {
  topbarNav.innerHTML = '';
}

if (isHomeEmbed && bodyElement) {
  bodyElement.classList.add('flow-embed-home');
}

function readSavedSidebarState() {
  try {
    const savedState = window.localStorage.getItem(pageSidebarStorageKey);
    return savedState === null ? true : savedState === 'true';
  } catch (error) {
    return true;
  }
}

function persistSidebarState(value) {
  try {
    window.localStorage.setItem(pageSidebarStorageKey, String(value));
  } catch (error) {
    // Ignore storage failures and keep the state only in memory.
  }
}

function initSidebarTooltips(sidebarRoot, compactSidebarQuery) {
  if (!sidebarRoot || !bodyElement) {
    return () => {};
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'page-sidebar-tooltip';
  tooltip.hidden = true;
  tooltip.innerHTML = `
    <div class="page-sidebar-tooltip__title"></div>
    <div class="page-sidebar-tooltip__meta"></div>
  `;
  document.body.appendChild(tooltip);

  const tooltipTitle = tooltip.querySelector('.page-sidebar-tooltip__title');
  const tooltipMeta = tooltip.querySelector('.page-sidebar-tooltip__meta');
  let activeTarget = null;
  let hideTimer = 0;

  const shouldShowTooltip = () => bodyElement.classList.contains('page-sidebar-collapsed') && !compactSidebarQuery.matches;

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
    }, sidebarTooltipHideDelay);
  };

  const showTooltip = (target) => {
    if (!shouldShowTooltip()) {
      return;
    }

    activeTarget = target;
    window.clearTimeout(hideTimer);
    tooltipTitle.textContent = target.dataset.tooltip || '';
    tooltipMeta.textContent = target.dataset.tooltipMeta || '';
    tooltipMeta.hidden = !target.dataset.tooltipMeta;
    tooltip.hidden = false;
    positionTooltip(target);

    requestAnimationFrame(() => {
      tooltip.classList.add('is-visible');
    });
  };

  sidebarRoot.querySelectorAll('.page-sidebar__link[data-tooltip], .page-sidebar__spotlight[data-tooltip]').forEach((link) => {
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

function mountFlowSidebar() {
  if (!bodyElement || !bodyElement.classList.contains('page-flow')) {
    return;
  }

  const sidebarShell = document.createElement('div');
  sidebarShell.className = 'page-sidebar-shell';
  sidebarShell.innerHTML = `
    <button
      type="button"
      class="page-sidebar__mobile-trigger"
      id="page-sidebar-mobile-trigger"
      aria-controls="page-sidebar"
      aria-expanded="false"
    >
      <span class="page-sidebar__mobile-badge" aria-hidden="true">
        <img src="../assets/icons/book.svg" alt="" class="icon-svg icon-svg--button">
      </span>
      <span>Atalhos</span>
    </button>

    <div class="page-sidebar__backdrop" id="page-sidebar-backdrop" hidden></div>

    <aside class="page-sidebar" id="page-sidebar" aria-label="Atalhos do HELPIEEE">
      <div class="page-sidebar__panel">
        <div class="page-sidebar__header">
          <div class="page-sidebar__header-copy">
            <div class="page-sidebar__eyebrow">Navegação lateral</div>
            <h2 class="page-sidebar__title">Atalhos do HELPIEEE</h2>
          </div>
          <button
            type="button"
            class="page-sidebar__toggle"
            id="page-sidebar-toggle"
            aria-controls="page-sidebar"
            aria-expanded="true"
            aria-label="Recolher atalhos"
          >
            <span class="page-sidebar__toggle-bar"></span>
            <span class="page-sidebar__toggle-bar"></span>
          </button>
        </div>

        <p class="page-sidebar__desc">Navegue pelo restante do guia sem perder o fluxo curricular de vista.</p>

        <div class="page-sidebar__current">
          <span class="page-sidebar__group-label">Você está em</span>
          <strong class="page-sidebar__current-title">Fluxo Curricular</strong>
          <span class="page-sidebar__current-meta">Pré-requisitos, habilitações e comparação entre grades.</span>
        </div>

        <nav class="page-sidebar__nav" aria-label="Páginas do guia">
          <a
            href="${flowSidebarSpotlightRoute.href}"
            class="page-sidebar__spotlight"
            data-tooltip="${flowSidebarSpotlightRoute.label}"
            data-tooltip-meta="${flowSidebarSpotlightRoute.meta}"
          >
            <span class="page-sidebar__spotlight-icon" aria-hidden="true">
              <img src="${flowSidebarSpotlightRoute.icon}" alt="" class="icon-svg">
            </span>
            <span class="page-sidebar__spotlight-copy">
              <span class="page-sidebar__spotlight-kicker">${flowSidebarSpotlightRoute.kicker}</span>
              <span class="page-sidebar__spotlight-title">${flowSidebarSpotlightRoute.label}</span>
              <span class="page-sidebar__spotlight-desc">${flowSidebarSpotlightRoute.meta}</span>
            </span>
            <span class="page-sidebar__spotlight-cta">${flowSidebarSpotlightRoute.cta}</span>
          </a>

          <div class="page-sidebar__group">
            <div class="page-sidebar__group-label">Começo do curso</div>
            <div class="page-sidebar__links">
              ${flowPrimaryRoutes.map((route) => `
                <a
                  href="${route.href}"
                  class="page-sidebar__link${route.current ? ' current' : ''}"
                  ${route.current ? 'aria-current="page"' : ''}
                  data-tooltip="${route.label}"
                  data-tooltip-meta="${route.meta}"
                >
                  <span class="page-sidebar__icon" aria-hidden="true">
                    <img src="${route.icon}" alt="" class="icon-svg">
                  </span>
                  <span class="page-sidebar__link-copy">
                    <span class="page-sidebar__link-title">${route.label}</span>
                    <span class="page-sidebar__link-meta">${route.meta}</span>
                  </span>
                </a>
              `).join('')}
            </div>
          </div>

          <div class="page-sidebar__group">
            <div class="page-sidebar__group-label">Rede, oportunidades e projeto</div>
            <div class="page-sidebar__links">
              ${flowSecondaryRoutes.map((route) => `
                <a
                  href="${route.href}"
                  class="page-sidebar__link"
                  data-tooltip="${route.label}"
                  data-tooltip-meta="${route.meta}"
                >
                  <span class="page-sidebar__icon" aria-hidden="true">
                    <img src="${route.icon}" alt="" class="icon-svg">
                  </span>
                  <span class="page-sidebar__link-copy">
                    <span class="page-sidebar__link-title">${route.label}</span>
                    <span class="page-sidebar__link-meta">${route.meta}</span>
                  </span>
                </a>
              `).join('')}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  `;

  document.body.appendChild(sidebarShell);
  bodyElement.classList.add('has-page-sidebar');

  const pageSidebar = document.getElementById('page-sidebar');
  const pageSidebarToggle = document.getElementById('page-sidebar-toggle');
  const pageSidebarBackdrop = document.getElementById('page-sidebar-backdrop');
  const pageSidebarMobileTrigger = document.getElementById('page-sidebar-mobile-trigger');
  const compactSidebarQuery = window.matchMedia('(max-width: 1180px)');
  const syncSidebarTooltips = initSidebarTooltips(pageSidebar, compactSidebarQuery);
  let desktopSidebarTrigger = null;

  if (topbarNav && !isHomeEmbed) {
    desktopSidebarTrigger = document.createElement('button');
    desktopSidebarTrigger.type = 'button';
    desktopSidebarTrigger.className = 'topbar-sidebar-trigger';
    desktopSidebarTrigger.id = 'flow-topbar-sidebar-trigger';
    desktopSidebarTrigger.innerHTML = `
      <span class="topbar-sidebar-trigger__icon" aria-hidden="true"></span>
      <span class="topbar-sidebar-trigger__label">Mostrar atalhos</span>
    `;
    topbarNav.insertBefore(desktopSidebarTrigger, topbarNav.firstChild);
  }

  let pageSidebarHidden = readSavedSidebarState();
  let pageSidebarOpen = false;

  const syncPageSidebar = () => {
    const isCompact = compactSidebarQuery.matches;
    const isSidebarVisible = isCompact ? pageSidebarOpen : !pageSidebarHidden;

    bodyElement.classList.toggle('page-sidebar-hidden', !isCompact && pageSidebarHidden);
    bodyElement.classList.toggle('page-sidebar-open', isCompact && pageSidebarOpen);

    pageSidebar?.setAttribute('aria-hidden', String(!isSidebarVisible));
    pageSidebar?.toggleAttribute('inert', !isSidebarVisible);

    if (pageSidebarToggle) {
      const expanded = isSidebarVisible;
      pageSidebarToggle.setAttribute('aria-expanded', String(expanded));
      pageSidebarToggle.setAttribute(
        'aria-label',
        isCompact
          ? (pageSidebarOpen ? 'Fechar atalhos' : 'Abrir atalhos')
          : (pageSidebarHidden ? 'Mostrar atalhos' : 'Ocultar atalhos'),
      );
    }

    if (pageSidebarMobileTrigger) {
      pageSidebarMobileTrigger.setAttribute('aria-expanded', String(isCompact && pageSidebarOpen));
    }

    if (pageSidebarBackdrop) {
      pageSidebarBackdrop.hidden = !(isCompact && pageSidebarOpen);
    }

    if (desktopSidebarTrigger) {
      desktopSidebarTrigger.hidden = isCompact;
      desktopSidebarTrigger.setAttribute('aria-expanded', String(!isCompact && !pageSidebarHidden));
      desktopSidebarTrigger.setAttribute('aria-label', pageSidebarHidden ? 'Mostrar atalhos' : 'Ocultar atalhos');
      desktopSidebarTrigger.classList.toggle('is-active', !isCompact && !pageSidebarHidden);

      const desktopSidebarTriggerLabel = desktopSidebarTrigger.querySelector('.topbar-sidebar-trigger__label');

      if (desktopSidebarTriggerLabel) {
        desktopSidebarTriggerLabel.textContent = pageSidebarHidden ? 'Mostrar atalhos' : 'Ocultar atalhos';
      }
    }

    syncSidebarTooltips();
  };

  const togglePageSidebar = () => {
    if (compactSidebarQuery.matches) {
      pageSidebarOpen = !pageSidebarOpen;
    } else {
      pageSidebarHidden = !pageSidebarHidden;
      persistSidebarState(pageSidebarHidden);
    }

    syncPageSidebar();
    redrawArrows();
  };

  const closePageSidebar = () => {
    if (!compactSidebarQuery.matches) {
      return;
    }

    pageSidebarOpen = false;
    syncPageSidebar();
  };

  pageSidebarToggle?.addEventListener('click', togglePageSidebar);
  pageSidebarMobileTrigger?.addEventListener('click', togglePageSidebar);
  desktopSidebarTrigger?.addEventListener('click', togglePageSidebar);
  pageSidebarBackdrop?.addEventListener('click', closePageSidebar);

  pageSidebar?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (compactSidebarQuery.matches) {
        closePageSidebar();
      }
    });
  });

  if (typeof compactSidebarQuery.addEventListener === 'function') {
    compactSidebarQuery.addEventListener('change', () => {
      pageSidebarOpen = false;
      syncPageSidebar();
      redrawArrows();
    });
  } else if (typeof compactSidebarQuery.addListener === 'function') {
    compactSidebarQuery.addListener(() => {
      pageSidebarOpen = false;
      syncPageSidebar();
      redrawArrows();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && compactSidebarQuery.matches && pageSidebarOpen) {
      closePageSidebar();
    }
  });

  syncPageSidebar();
}

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

function getSearchSnippetPreview(text, queryTokens) {
  const plainText = condenseText(text);

  if (!plainText) {
    return '';
  }

  if (!queryTokens.length) {
    return plainText.slice(0, 160);
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
    return plainText.slice(0, 160);
  }

  const previewStart = Math.max(0, firstMatchIndex - 40);
  const previewEnd = Math.min(plainText.length, previewStart + 168);
  const preview = plainText.slice(previewStart, previewEnd).trim();

  return `${previewStart > 0 ? '…' : ''}${preview}${previewEnd < plainText.length ? '…' : ''}`;
}

function buildFlowSearchIndex() {
  return Object.entries(curricula).flatMap(([curriculumKey, curriculum]) => {
    const curriculumLabel = curriculum.title.replace(/^Fluxo Curricular\s*—\s*/, '');

    return Object.values(curriculum.discs).map((disc) => {
      const prereqCodes = disc.prereqs.filter((item) => curriculum.discs[item]);
      const prereqNames = prereqCodes.map((item) => curriculum.discs[item].name);
      const unlockCodes = (curriculum.unlocks[disc.code] || []).filter((item) => curriculum.discs[item]);
      const unlockNames = unlockCodes.map((item) => curriculum.discs[item].name);
      const snippetParts = [
        `${disc.period}º período`,
        `${disc.value} ${curriculum.unitShort}`,
        prereqNames.length ? `Pré-req: ${prereqNames.slice(0, 2).join(', ')}` : 'Sem pré-requisito direto',
        unlockNames.length ? `Desbloqueia: ${unlockNames.slice(0, 2).join(', ')}` : '',
      ].filter(Boolean);
      const snippet = snippetParts.join(' · ');
      const fullText = [
        disc.code,
        disc.name,
        curriculumLabel,
        curriculum.subtitle,
        `${disc.period} periodo`,
        `${disc.value} ${curriculum.unitShort} ${curriculum.unitLong}`,
        prereqCodes.join(' '),
        prereqNames.join(' '),
        unlockCodes.join(' '),
        unlockNames.join(' '),
      ].join(' ');

      return {
        curriculumKey,
        curriculumLabel,
        code: disc.code,
        title: disc.name,
        meta: `${disc.code} · ${curriculumLabel}`,
        snippet,
        searchValue: buildSearchHaystack(fullText),
        titleValue: normalizeSearchValue(disc.name),
        titleVariants: buildSearchVariants(disc.name),
        titleSearchValue: buildSearchHaystack(disc.name),
        codeValue: normalizeSearchValue(disc.code),
        codeVariants: buildSearchVariants(disc.code),
        codeSearchValue: buildSearchHaystack(disc.code),
        metaValue: normalizeSearchValue(`${disc.code} ${curriculumLabel}`),
        metaSearchValue: buildSearchHaystack(`${disc.code} ${curriculumLabel}`),
        textValue: normalizeSearchValue(`${snippet} ${curriculum.subtitle} ${prereqNames.join(' ')} ${unlockNames.join(' ')}`),
        textSearchValue: buildSearchHaystack(`${snippet} ${curriculum.subtitle} ${prereqNames.join(' ')} ${unlockNames.join(' ')}`),
      };
    });
  });
}

const flowSearchIndex = buildFlowSearchIndex();

function scoreFlowSearchEntry(entry, query) {
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

  if (hasExactSearchVariant(entry.codeVariants, exactNeedles)) {
    score += 340;
  } else if (hasStartsWithSearchVariant(entry.codeVariants, exactNeedles)) {
    score += 240;
  }

  if (hasExactSearchVariant(entry.titleVariants, exactNeedles)) {
    score += 300;
  } else if (hasStartsWithSearchVariant(entry.titleVariants, exactNeedles)) {
    score += 210;
  } else if (hasIncludesSearchVariant(entry.titleSearchValue, exactNeedles)) {
    score += 140;
  }

  if (hasIncludesSearchVariant(entry.metaSearchValue, exactNeedles) || (normalized && entry.metaValue.includes(normalized))) {
    score += 70;
  }

  if (hasIncludesSearchVariant(entry.textSearchValue, exactNeedles) || (normalized && entry.textValue.includes(normalized))) {
    score += 90;
  }

  if (entry.curriculumKey === activeCurriculumKey) {
    score += 36;
  }

  tokens.forEach((token) => {
    if (entry.codeSearchValue.startsWith(token) || entry.codeVariants.some((variant) => variant.startsWith(token))) {
      score += 48;
    } else if (entry.codeSearchValue.includes(token)) {
      score += 26;
    }

    if (entry.titleSearchValue.startsWith(token) || entry.titleVariants.some((variant) => variant.startsWith(token))) {
      score += 42;
    } else if (entry.titleSearchValue.includes(token)) {
      score += 28;
    }

    if (entry.metaSearchValue.includes(token)) {
      score += 14;
    }

    if (entry.textSearchValue.includes(token)) {
      score += 10;
    }
  });

  return score;
}

function flashDiscTarget(target) {
  if (!target) {
    return;
  }

  if (highlightedSearchDisc && highlightedSearchDisc !== target) {
    highlightedSearchDisc.classList.remove('disc-search-active');
  }

  window.clearTimeout(highlightedSearchTimer);
  highlightedSearchDisc = target;
  target.classList.add('disc-search-active');

  highlightedSearchTimer = window.setTimeout(() => {
    target.classList.remove('disc-search-active');

    if (highlightedSearchDisc === target) {
      highlightedSearchDisc = null;
    }
  }, searchHighlightDuration);
}

function focusDiscipline(code) {
  if (!activeCurriculum?.discs[code]) {
    return;
  }

  selectedCode = code;
  applyStates();
  updateInfoBar();

  if (showArrows) {
    drawArrows();
  }

  const target = document.getElementById(getDiscId(code));

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    flashDiscTarget(target);
  }
}

function openFlowSearchResult(result) {
  if (!result) {
    return;
  }

  setMode('navigate');

  if (activeCurriculumKey !== result.curriculumKey) {
    applyCurriculum(result.curriculumKey);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        focusDiscipline(result.code);
      });
    });
    return;
  }

  focusDiscipline(result.code);
}

function mountFlowSearch() {
  const header = document.querySelector('.site-topbar');

  if (!header) {
    return;
  }

  const searchShell = document.createElement('div');
  searchShell.className = 'site-topbar__search';
  searchShell.innerHTML = `
    <div class="flow-search flow-search--topbar">
      <div class="flow-search__field">
        <span class="flow-search__icon" aria-hidden="true"></span>
        <input
          type="search"
          class="flow-search__input"
          id="flow-search-input"
          placeholder="Buscar disciplina, código ou grade"
          autocomplete="off"
          spellcheck="false"
        >
        <button type="button" class="flow-search__clear" id="flow-search-clear" hidden>Limpar</button>
      </div>
      <div class="flow-search-results" id="flow-search-results" hidden></div>
    </div>
  `;

  if (topbarNav) {
    header.insertBefore(searchShell, topbarNav);
  } else {
    header.appendChild(searchShell);
  }

  const searchInput = searchShell.querySelector('.flow-search__input');
  const searchClear = searchShell.querySelector('.flow-search__clear');
  const searchResults = searchShell.querySelector('.flow-search-results');
  let activeResults = [];
  let activeResultIndex = -1;

  const syncActiveResult = () => {
    searchResults.querySelectorAll('.flow-search-result[data-search-index]').forEach((button) => {
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

    const boundedIndex = (nextIndex + activeResults.length) % activeResults.length;
    activeResultIndex = boundedIndex;
    syncActiveResult();
  };

  const hideResults = () => {
    activeResults = [];
    activeResultIndex = -1;
    searchResults.hidden = true;
    searchResults.innerHTML = '';
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

    activeResults = flowSearchIndex
      .map((entry) => ({
        ...entry,
        score: scoreFlowSearchEntry(entry, query),
      }))
      .filter((entry) => entry.score >= 0)
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'pt-BR'))
      .slice(0, 8)
      .map((entry) => ({
        ...entry,
        preview: getSearchSnippetPreview(entry.snippet, queryTokens),
      }));

    if (!activeResults.length) {
      activeResultIndex = -1;
      searchResults.hidden = false;
      searchResults.innerHTML = `
        <div class="flow-search-results__empty">
          Nenhuma disciplina encontrada. Tente outro nome, código ou grade.
        </div>
      `;
      return;
    }

    activeResultIndex = 0;
    searchResults.hidden = false;
    searchResults.innerHTML = activeResults.map((result, index) => `
      <button type="button" class="flow-search-result${index === activeResultIndex ? ' is-active' : ''}" data-search-index="${index}">
        <span class="flow-search-result__eyebrow">${escapeHtml(result.curriculumLabel)}</span>
        <span class="flow-search-result__title">${escapeHtml(result.title)}</span>
        <span class="flow-search-result__meta">${escapeHtml(result.meta)}</span>
        <span class="flow-search-result__snippet">${escapeHtml(result.preview)}</span>
      </button>
    `).join('');
  };

  const openActiveResult = () => {
    const targetIndex = activeResultIndex >= 0 ? activeResultIndex : 0;
    const result = activeResults[targetIndex];

    if (!result) {
      return;
    }

    openFlowSearchResult(result);
    hideResults();
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
      openActiveResult();
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

    activeResultIndex = Number(resultButton.dataset.searchIndex);
    openActiveResult();
  });

  document.addEventListener('click', (event) => {
    if (!searchShell.contains(event.target)) {
      hideResults();
    }
  });
}

function getCurriculumLabel() {
  return activeCurriculum.title.replace(/^Fluxo Curricular\s*—\s*/, '');
}

function notifyParent() {
  window.parent?.postMessage(
    {
      type: 'helpieee-flow-change',
      curriculumKey: activeCurriculumKey,
      label: getCurriculumLabel(),
      subtitle: activeCurriculum.subtitle
    },
    '*'
  );
}

function getDiscId(code) {
  const slug = code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `disc-${slug}`;
}

function getElementFrame(element, container) {
  let left = element.offsetLeft;
  let top = element.offsetTop;
  let parent = element.offsetParent;

  while (parent && parent !== container) {
    left += parent.offsetLeft;
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }

  return {
    left,
    top,
    right: left + element.offsetWidth,
    centerY: top + element.offsetHeight / 2
  };
}

function getStorageKey(curriculumKey) {
  return `helpieee-flow-done-${curriculumKey}`;
}

function loadDoneSet(curriculumKey) {
  const storageKey = getStorageKey(curriculumKey);
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  return new Set(saved.filter((code) => activeCurriculum.discs[code]));
}

function saveDoneSet() {
  localStorage.setItem(getStorageKey(activeCurriculumKey), JSON.stringify([...doneSet]));
}

function updateInfoBar() {
  if (mode === 'mark') {
    infoBar.textContent = 'Clique para marcar disciplinas cursadas';
    return;
  }

  if (!selectedCode || !activeCurriculum.discs[selectedCode]) {
    infoBar.textContent = 'Clique em uma disciplina';
    return;
  }

  const disc = activeCurriculum.discs[selectedCode];
  const prereqs = disc.prereqs.filter((code) => activeCurriculum.discs[code]);
  const unlocks = (activeCurriculum.unlocks[selectedCode] || []).filter((code) => activeCurriculum.discs[code]);
  infoBar.textContent = `${disc.name} · ${prereqs.length} pré-req · desbloqueia ${unlocks.length}`;
}

function applyStates() {
  const prereqSet = selectedCode ? new Set(activeCurriculum.discs[selectedCode]?.prereqs || []) : new Set();
  const unlockSet = selectedCode ? new Set(activeCurriculum.unlocks[selectedCode] || []) : new Set();

  document.querySelectorAll('.disc').forEach((element) => {
    const code = element.dataset.code;

    element.classList.remove('active', 'prereq', 'unlocks', 'done');

    if (doneSet.has(code)) {
      element.classList.add('done');
    }

    if (code === selectedCode) {
      element.classList.add('active');
    } else if (prereqSet.has(code)) {
      element.classList.add('prereq');
    } else if (unlockSet.has(code)) {
      element.classList.add('unlocks');
    }
  });
}

function updateProgress() {
  const doneCount = doneSet.size;
  const doneValue = [...doneSet].reduce((sum, code) => sum + (activeCurriculum.discs[code]?.value || 0), 0);
  const progress = activeCurriculum.totalDiscs ? (doneCount / activeCurriculum.totalDiscs) * 100 : 0;

  document.getElementById('done-count').textContent = doneCount;
  document.getElementById('total-count').textContent = activeCurriculum.totalDiscs;
  document.getElementById('credits-done').textContent = `${doneValue} / ${activeCurriculum.totalValue} ${activeCurriculum.unitLong}`;
  document.getElementById('progress-fill').style.width = `${progress}%`;
}

function updateStickyScrollbar() {
  if (!scrollHost || !stickyScrollbar || !stickyScrollbarFill || !stickyScrollbarShell) {
    return;
  }

  const scrollWidth = Math.max(scrollHost.scrollWidth, scrollHost.clientWidth);
  const bottomBarHeight = bottomBar?.offsetHeight || 0;
  const hasHorizontalOverflow = scrollHost.scrollWidth - scrollHost.clientWidth > 1;
  const useDirectFlowScroll = directFlowScrollQuery.matches;

  stickyScrollbarFill.style.width = `${scrollWidth}px`;
  stickyScrollbarShell.hidden = useDirectFlowScroll || !hasHorizontalOverflow;

  if (!useDirectFlowScroll) {
    stickyScrollbar.scrollLeft = scrollHost.scrollLeft;
  }

  document.documentElement.style.setProperty('--bottom-bar-height', `${bottomBarHeight}px`);
}

function build() {
  grid.querySelectorAll('.period-col').forEach((element) => element.remove());

  grid.style.setProperty('--period-count', activeCurriculum.periodCount);
  grid.style.setProperty('--grid-min-width', `${activeCurriculum.periodCount * 160 + 40}px`);

  for (let period = 1; period <= activeCurriculum.periodCount; period += 1) {
    const column = document.createElement('div');
    column.className = 'period-col';
    column.dataset.period = period;

    const label = document.createElement('div');
    label.className = 'period-label';
    label.textContent = `${period}º per.`;
    column.appendChild(label);

    (activeCurriculum.periods[period] || []).forEach((disc) => {
      const card = document.createElement('div');
      card.className = 'disc';
      card.id = getDiscId(disc.code);
      card.dataset.code = disc.code;
      card.innerHTML = `
        <div class="disc-done-check">✓</div>
        <div class="disc-code">${disc.code}</div>
        <div class="disc-name">${disc.name}</div>
        <div class="disc-credits">${disc.value} ${activeCurriculum.unitShort}</div>
      `;

      card.addEventListener('click', () => handleClick(disc.code));
      card.addEventListener('mouseenter', (event) => showTooltip(event, disc.code));
      card.addEventListener('mousemove', moveTooltip);
      card.addEventListener('mouseleave', hideTooltip);

      column.appendChild(card);
    });

    grid.appendChild(column);
  }

  applyStates();
  updateInfoBar();
  updateProgress();

  if (showArrows) {
    drawArrows();
  } else {
    document.getElementById('arrows-svg').innerHTML = '';
  }

  updateStickyScrollbar();
}

function handleClick(code) {
  if (mode === 'mark') {
    if (doneSet.has(code)) {
      doneSet.delete(code);
    } else {
      doneSet.add(code);
    }

    saveDoneSet();
    applyStates();
    updateProgress();

    if (showArrows) {
      drawArrows();
    }

    return;
  }

  selectedCode = selectedCode === code ? null : code;
  applyStates();
  updateInfoBar();

  if (showArrows) {
    drawArrows();
  }
}

function drawArrows() {
  const svg = document.getElementById('arrows-svg');
  svg.innerHTML = '';

  const width = Math.max(grid.scrollWidth, grid.clientWidth);
  const height = Math.max(grid.scrollHeight, grid.clientHeight);
  const prereqSet = selectedCode ? new Set(activeCurriculum.discs[selectedCode]?.prereqs || []) : new Set();
  const unlockSet = selectedCode ? new Set(activeCurriculum.unlocks[selectedCode] || []) : new Set();
  const edges = [];

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));

  Object.values(activeCurriculum.discs).forEach((disc) => {
    disc.prereqs.forEach((prereq) => {
      if (activeCurriculum.discs[prereq]) {
        edges.push({ from: prereq, to: disc.code });
      }
    });
  });

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  ['default', 'prereq', 'unlocks'].forEach((type) => {
    const color =
      type === 'prereq' ? '#F59200' : type === 'unlocks' ? '#1A8C5B' : 'rgba(0,133,202,0.3)';
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    marker.setAttribute('id', `arrow-${type}`);
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '8');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '5');
    marker.setAttribute('markerHeight', '5');
    marker.setAttribute('orient', 'auto-start-reverse');

    path.setAttribute('d', 'M2 2L8 5L2 8');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');

    marker.appendChild(path);
    defs.appendChild(marker);
  });
  svg.appendChild(defs);

  edges.forEach(({ from, to }) => {
    const fromEl = document.getElementById(getDiscId(from));
    const toEl = document.getElementById(getDiscId(to));

    if (!fromEl || !toEl) {
      return;
    }

    const fromFrame = getElementFrame(fromEl, grid);
    const toFrame = getElementFrame(toEl, grid);
    const isPrereq = selectedCode && prereqSet.has(from) && to === selectedCode;
    const isUnlock = selectedCode && from === selectedCode && unlockSet.has(to);
    const isDimmed = selectedCode && !isPrereq && !isUnlock;

    const x1 = fromFrame.right;
    const y1 = fromFrame.centerY;
    const x2 = toFrame.left - 2;
    const y2 = toFrame.centerY;
    const cx1 = x1 + (x2 - x1) * 0.5;
    const cx2 = x2 - (x2 - x1) * 0.5;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute('d', `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`);
    path.setAttribute('vector-effect', 'non-scaling-stroke');

    let className = 'arrow-line';
    let markerType = 'default';

    if (isPrereq) {
      className += ' highlight-prereq';
      markerType = 'prereq';
    } else if (isUnlock) {
      className += ' highlight-unlocks';
      markerType = 'unlocks';
    } else if (isDimmed) {
      className += ' dimmed';
    }

    path.setAttribute('class', className);
    path.setAttribute('marker-end', `url(#arrow-${markerType})`);
    svg.appendChild(path);
  });
}

function showTooltip(event, code) {
  if (!discTooltipHoverQuery.matches) {
    hideTooltip();
    return;
  }

  const disc = activeCurriculum.discs[code];
  const prereqs = disc.prereqs.filter((item) => activeCurriculum.discs[item]).map((item) => activeCurriculum.discs[item].name);
  const unlocks = (activeCurriculum.unlocks[code] || [])
    .filter((item) => activeCurriculum.discs[item])
    .map((item) => activeCurriculum.discs[item].name);
  const tooltip = document.getElementById('tooltip');

  tooltip.innerHTML = `
    <div class="tooltip-title">${disc.name}</div>
    <div class="tooltip-row">Código: <span>${disc.code}</span></div>
    <div class="tooltip-row">${activeCurriculum.valueLabel}: <span>${disc.value} ${activeCurriculum.unitShort}</span></div>
    ${prereqs.length ? `<div class="tooltip-row">Pré-req: <span>${prereqs.join(', ')}</span></div>` : ''}
    ${
      unlocks.length
        ? `<div class="tooltip-row">Desbloqueia: <span>${unlocks.slice(0, 3).join(', ')}${unlocks.length > 3 ? '…' : ''}</span></div>`
        : ''
    }
    ${
      mode === 'mark'
        ? `<div class="tooltip-row tooltip-row--marking">Clique para ${doneSet.has(code) ? 'desmarcar' : 'marcar como cursada'}</div>`
        : ''
    }
  `;

  tooltip.classList.add('show');
  moveTooltip(event);
}

function moveTooltip(event) {
  if (!discTooltipHoverQuery.matches) {
    return;
  }

  const tooltip = document.getElementById('tooltip');
  const x = event.clientX + 14;
  const y = event.clientY - 10;
  const overRight = x + 250 > window.innerWidth;

  tooltip.style.left = `${overRight ? event.clientX - 260 : x}px`;
  tooltip.style.top = `${y}px`;
}

function hideTooltip() {
  document.getElementById('tooltip').classList.remove('show');
}

if (typeof discTooltipHoverQuery.addEventListener === 'function') {
  discTooltipHoverQuery.addEventListener('change', () => {
    if (!discTooltipHoverQuery.matches) {
      hideTooltip();
    }
  });
} else if (typeof discTooltipHoverQuery.addListener === 'function') {
  discTooltipHoverQuery.addListener(() => {
    if (!discTooltipHoverQuery.matches) {
      hideTooltip();
    }
  });
}

function redrawArrows() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    if (showArrows) {
      drawArrows();
    }

    updateStickyScrollbar();
  });
}

function syncHorizontalScroll(source, target) {
  if (!source || !target || syncingStickyScrollbar || directFlowScrollQuery.matches) {
    return;
  }

  syncingStickyScrollbar = true;
  target.scrollLeft = source.scrollLeft;

  requestAnimationFrame(() => {
    syncingStickyScrollbar = false;
  });
}

function resetDone() {
  doneSet.clear();
  localStorage.removeItem(getStorageKey(activeCurriculumKey));
  applyStates();
  updateProgress();

  if (showArrows) {
    drawArrows();
  }
}

function toggleArrows() {
  showArrows = !showArrows;

  const button = document.getElementById('btn-arrows');
  button.textContent = showArrows ? 'Ativado' : 'Desativado';
  button.classList.toggle('active', showArrows);

  if (showArrows) {
    drawArrows();
  } else {
    document.getElementById('arrows-svg').innerHTML = '';
  }
}

function setMode(nextMode) {
  mode = nextMode;
  selectedCode = nextMode === 'mark' ? null : selectedCode;

  document.getElementById('btn-mode-nav').classList.toggle('active', nextMode === 'navigate');
  document.getElementById('btn-mode-mark').classList.toggle('active', nextMode === 'mark');

  applyStates();
  updateInfoBar();

  if (showArrows) {
    drawArrows();
  }
}

function applyCurriculum(curriculumKey) {
  if (!curricula[curriculumKey]) {
    return;
  }

  activeCurriculumKey = curriculumKey;
  activeCurriculum = curricula[curriculumKey];
  selectedCode = null;
  doneSet = loadDoneSet(curriculumKey);
  document.body.dataset.curriculum = curriculumKey;

  document.getElementById('flow-title').textContent = activeCurriculum.title;
  document.getElementById('flow-subtitle').textContent = activeCurriculum.subtitle;
  document.title = `${activeCurriculum.title} — HELPIEEE`;

  if (curriculumSelect) {
    curriculumSelect.value = curriculumKey;
  }

  build();
  notifyParent();
}

function bindControls() {
  document.getElementById('btn-arrows')?.addEventListener('click', toggleArrows);
  document.getElementById('btn-mode-nav')?.addEventListener('click', () => setMode('navigate'));
  document.getElementById('btn-mode-mark')?.addEventListener('click', () => setMode('mark'));
  document.getElementById('btn-reset')?.addEventListener('click', resetDone);
  curriculumSelect?.addEventListener('change', (event) => applyCurriculum(event.target.value));
  stickyScrollbar?.addEventListener('scroll', () => syncHorizontalScroll(stickyScrollbar, scrollHost));
}

if (activeCurriculum) {
  if (!isHomeEmbed) {
    mountFlowSidebar();
    mountFlowSearch();
  }

  bindControls();
  applyCurriculum(activeCurriculumKey);
  window.addEventListener('resize', redrawArrows);

  if (typeof directFlowScrollQuery.addEventListener === 'function') {
    directFlowScrollQuery.addEventListener('change', redrawArrows);
  } else if (typeof directFlowScrollQuery.addListener === 'function') {
    directFlowScrollQuery.addListener(redrawArrows);
  }

  scrollHost?.addEventListener('scroll', () => {
    syncHorizontalScroll(scrollHost, stickyScrollbar);
  });
}
