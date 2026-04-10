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
const infoBar = document.getElementById('info-bar');
const curriculumSelect = document.getElementById('curriculum-select');

let activeCurriculumKey = curriculumSelect?.value || Object.keys(curricula)[0];
let activeCurriculum = curricula[activeCurriculumKey];
let selectedCode = null;
let showArrows = true;
let mode = 'navigate';
let doneSet = new Set();
let rafId;
let syncingStickyScrollbar = false;

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

  stickyScrollbarFill.style.width = `${scrollWidth}px`;
  stickyScrollbarShell.hidden = !hasHorizontalOverflow;
  stickyScrollbar.scrollLeft = scrollHost.scrollLeft;
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
  if (!source || !target || syncingStickyScrollbar) {
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
  bindControls();
  applyCurriculum(activeCurriculumKey);
  window.addEventListener('resize', redrawArrows);
  scrollHost?.addEventListener('scroll', () => {
    redrawArrows();
    syncHorizontalScroll(scrollHost, stickyScrollbar);
  });
}
