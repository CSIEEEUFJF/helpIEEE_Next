const bodyElement = document.body;
const currentContentPage = window.location.pathname.split('/').pop().split('?')[0];
const pageSidebarStorageKey = 'helpieee-site-sidebar-collapsed';
const legacySidebarStorageKey = 'helpieee-home-sidebar-collapsed';
const sidebarTooltipHideDelay = 120;

const sidebarSpotlightRoute = {
  href: 'fluxo.html',
  label: 'Fluxo Curricular',
  sidebarLabel: 'Fluxo Curricular',
  file: 'fluxo.html',
  meta: 'pré-requisitos, grades e visão de longo prazo do curso',
  icon: '../assets/icons/blueprint.svg',
  kicker: 'Mais acessado',
  cta: 'Abrir'
};

const contentPagePrimaryRoutes = [
  { href: 'primeiros-passos.html', label: 'Primeiros Passos', sidebarLabel: 'Primeiros Passos', file: 'primeiros-passos.html', meta: 'internet, RU, laboratórios e começo do semestre', icon: '../assets/icons/document.svg' },
  { href: 'faculdade.html', label: 'Funcionamento da Faculdade', sidebarLabel: 'Funcionamento da Faculdade', file: 'faculdade.html', meta: 'SIGA, IRA, RAG, glossário e regras da vida acadêmica', icon: '../assets/icons/faculty.svg' },
  { href: 'fluxo.html', label: 'Fluxo Curricular', sidebarLabel: 'Fluxo Curricular', file: 'fluxo.html', meta: 'pré-requisitos, grades e visão de longo prazo do curso', icon: '../assets/icons/blueprint.svg' }
];

const contentPageSecondaryRoutes = [
  { href: 'comunidade.html', label: 'Comunidade', sidebarLabel: 'Comunidade', file: 'comunidade.html', meta: 'apoio, grupos, monitoria e rotina com outras pessoas', icon: '../assets/icons/community.svg' },
  { href: 'ieee.html', label: 'IEEE & Oportunidades', sidebarLabel: 'IEEE & Oportunidades', file: 'ieee.html', meta: 'capítulos, equipes, eventos e portas de entrada', icon: '../assets/icons/circuit.svg' },
  { href: 'sobre-nos.html', label: 'Sobre Nós', sidebarLabel: 'Sobre Nós', file: 'sobre-nos.html', meta: 'propósito, projeto e jeito de usar o HELPIEEE', icon: '../assets/icons/engineering.svg' }
];

const contentPageRoutes = [
  sidebarSpotlightRoute,
  ...contentPagePrimaryRoutes,
  ...contentPageSecondaryRoutes
];

const topbarNav = document.querySelector('.topbar-nav');
const pageMain = document.querySelector('.page-main');
const currentHighlightDuration = 1800;

let highlightedSearchTarget = null;
let highlightedSearchTimer = 0;

function isCurrentContentRoute(route) {
  if (route.matchPrefix) {
    return currentContentPage === route.file || currentContentPage.startsWith(route.matchPrefix);
  }

  return route.file === currentContentPage;
}

const currentContentRoute = contentPageRoutes.find((route) => isCurrentContentRoute(route));
const currentRouteLabel = currentContentRoute ? (currentContentRoute.sidebarLabel || currentContentRoute.label) : 'Esta página';
const currentRouteIcon = currentContentRoute?.icon || '../assets/icons/document.svg';

const academicCalendarLegendMap = {
  inicio: { label: 'Marco letivo' },
  matricula: { label: 'Matrícula e ajuste' },
  prazo: { label: 'Prazo e atendimento' },
  recesso: { label: 'Recesso letivo' },
  feriado: { label: 'Feriado' },
};

const academicCalendarLegendOrder = ['inicio', 'matricula', 'prazo', 'recesso', 'feriado'];
const academicCalendarWeekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const facultyAcademicCalendarMonths = [
  {
    key: '2026-02',
    year: 2026,
    month: 2,
    schoolDays: 0,
    events: [
      buildAcademicCalendarEvent('2026-02-03', 'prazo', 'Data limite para regularização de pendências dos formandos do 2º/2025'),
      buildAcademicCalendarEvent('2026-02-16', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-02-17', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-02-18', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-02-20', 'matricula', 'Matrícula feita pelos acadêmicos para o 1º/2026, no SIGA (1ª etapa)', '2026-02-25'),
      buildAcademicCalendarEvent('2026-02-25', 'prazo', 'Último dia para pedido de reintegração para o 1º/2026'),
      buildAcademicCalendarEvent('2026-02-26', 'matricula', '1ª análise de matrícula CGCO', '2026-02-27'),
    ],
  },
  {
    key: '2026-03',
    year: 2026,
    month: 3,
    schoolDays: 14,
    events: [
      buildAcademicCalendarEvent('2026-03-02', 'matricula', 'Matrícula feita pelos acadêmicos para o 1º/2026, no SIGA (2ª etapa)', '2026-03-04'),
      buildAcademicCalendarEvent('2026-03-05', 'matricula', 'Ajuste no plano departamental'),
      buildAcademicCalendarEvent('2026-03-06', 'matricula', '2ª análise de matrícula CGCO'),
      buildAcademicCalendarEvent('2026-03-09', 'matricula', '2ª análise de matrícula CGCO'),
      buildAcademicCalendarEvent('2026-03-10', 'matricula', 'Matrícula feita pelos acadêmicos para o 1º/2026, no SIGA (3ª etapa)', '2026-03-11'),
      buildAcademicCalendarEvent('2026-03-12', 'matricula', '3ª análise de matrícula CGCO'),
      buildAcademicCalendarEvent('2026-03-13', 'matricula', 'Ajuste de matrícula feito pelos coordenadores', '2026-03-31'),
      buildAcademicCalendarEvent('2026-03-16', 'inicio', 'Primeiro dia letivo do 1º/2026'),
      buildAcademicCalendarEvent('2026-03-18', 'prazo', 'Período para pedido de dispensa de disciplinas na Central de Atendimentos, Secretaria do Campus GV ou polos', '2026-03-30'),
      buildAcademicCalendarEvent('2026-03-24', 'prazo', 'Inscrição para matrícula em disciplina isolada nos cursos presenciais'),
    ],
  },
  {
    key: '2026-04',
    year: 2026,
    month: 4,
    schoolDays: 21,
    events: [
      buildAcademicCalendarEvent('2026-04-01', 'prazo', 'Confirmação de matrícula em disciplina isolada'),
      buildAcademicCalendarEvent('2026-04-01', 'prazo', 'Último dia para reclassificação de candidatos dos processos seletivos de ingresso'),
      buildAcademicCalendarEvent('2026-04-01', 'prazo', 'Data limite para envio ao Cerimonial da lista de formandos para a Colação de Grau Unificada 2º/2025'),
      buildAcademicCalendarEvent('2026-04-02', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-04-03', 'feriado', 'Feriado'),
      buildAcademicCalendarEvent('2026-04-04', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-04-06', 'prazo', 'Período de realização de colação de grau do 2º/2025', '2026-04-10'),
      buildAcademicCalendarEvent('2026-04-17', 'prazo', 'Inscrição para colação de grau do 1º/2026, via SIGA', '2026-04-22'),
      buildAcademicCalendarEvent('2026-04-20', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-04-21', 'feriado', 'Feriado'),
      buildAcademicCalendarEvent('2026-04-22', 'prazo', 'Data limite para solicitação de atualização ou correção de dados cadastrais pelos formandos'),
      buildAcademicCalendarEvent('2026-04-23', 'prazo', 'Autorização da inscrição para a colação de grau do 1º/2026 pelos coordenadores, via SIGA', '2026-04-29'),
      buildAcademicCalendarEvent('2026-04-24', 'prazo', 'Último dia para trancamento de disciplina, no SIGA, pelos acadêmicos'),
    ],
  },
  {
    key: '2026-05',
    year: 2026,
    month: 5,
    schoolDays: 24,
    events: [
      buildAcademicCalendarEvent('2026-05-01', 'feriado', 'Feriado'),
      buildAcademicCalendarEvent('2026-05-02', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-05-04', 'prazo', 'Data limite para o envio dos projetos vinculados às disciplinas extensionistas à CAEX'),
      buildAcademicCalendarEvent('2026-05-29', 'prazo', 'Data limite para estudantes formandos requererem, no SIGAX, flexibilização curricular'),
    ],
  },
  {
    key: '2026-06',
    year: 2026,
    month: 6,
    schoolDays: 22,
    events: [
      buildAcademicCalendarEvent('2026-06-01', 'prazo', 'Data limite para coordenadores solicitarem aos departamentos as vagas necessárias nas disciplinas para o 2º/2026'),
      buildAcademicCalendarEvent('2026-06-04', 'feriado', 'Feriado'),
      buildAcademicCalendarEvent('2026-06-05', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-06-06', 'recesso', 'Recesso letivo'),
      buildAcademicCalendarEvent('2026-06-13', 'feriado', 'Feriado'),
      buildAcademicCalendarEvent('2026-06-17', 'prazo', 'Período para pedidos de obtenção de nova modalidade e habilitação em cursos de mesma ABI', '2026-06-18'),
      buildAcademicCalendarEvent('2026-06-25', 'prazo', 'Data limite para os coordenadores devolverem, via SEI, os pedidos de dispensa ou equivalência de disciplinas e cômputo de opcionais à CDARA'),
      buildAcademicCalendarEvent('2026-06-29', 'prazo', 'Data limite para coordenadores autorizarem, no SIGAX, os requerimentos de aproveitamento de estudos e flexibilização dos formandos'),
      buildAcademicCalendarEvent('2026-06-29', 'prazo', 'Data limite para os chefes de departamentos responderem às solicitações de horário, vagas e cadastro das turmas do 2º/2026'),
    ],
  },
  {
    key: '2026-07',
    year: 2026,
    month: 7,
    schoolDays: 19,
    events: [
      buildAcademicCalendarEvent('2026-07-01', 'prazo', 'Último dia para digitação de horário linear, no SIGA, para o 2º/2026'),
      buildAcademicCalendarEvent('2026-07-06', 'prazo', 'Divulgação de horário linear para o 2º/2026'),
      buildAcademicCalendarEvent('2026-07-08', 'prazo', 'Data limite para os coordenadores enviarem à CDARA os horários dos calouros'),
      buildAcademicCalendarEvent('2026-07-22', 'inicio', 'Último dia letivo do 1º/2026'),
      buildAcademicCalendarEvent('2026-07-25', 'prazo', 'Último dia para lançamento de notas do 1º/2026'),
      buildAcademicCalendarEvent('2026-07-25', 'prazo', 'Data limite para regularização de pendências dos formandos do 1º/2026'),
      buildAcademicCalendarEvent('2026-07-27', 'matricula', 'Matrícula feita pelos acadêmicos para o 2º/2026, no SIGA (1ª etapa)', '2026-07-30'),
      buildAcademicCalendarEvent('2026-07-30', 'prazo', 'Último dia para pedido de reintegração para o 2º/2026'),
      buildAcademicCalendarEvent('2026-07-31', 'matricula', '1ª análise de matrícula CGCO'),
    ],
  },
];

if (topbarNav) {
  topbarNav.innerHTML = '';
}

function buildAcademicCalendarEvent(start, type, title, end = start) {
  return { start, end, type, title };
}

function parseAcademicDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function formatAcademicMonthLabel(year, month) {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const label = formatter.format(new Date(year, month - 1, 1, 12, 0, 0, 0));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatAcademicDateShort(dateString) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
  }).format(parseAcademicDate(dateString));
}

function formatAcademicDateLong(dateString) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parseAcademicDate(dateString));
}

function formatAcademicEventDateRange(start, end) {
  if (start === end) {
    return formatAcademicDateShort(start);
  }

  const startDate = parseAcademicDate(start);
  const endDate = parseAcademicDate(end);
  const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth) {
    return `${startDate.getDate()} a ${endDate.getDate()} ${new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(endDate)}`;
  }

  return `${formatAcademicDateShort(start)} a ${formatAcademicDateShort(end)}`;
}

function buildAcademicCalendarMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function isAcademicEventOnDate(event, dateKey) {
  return dateKey >= event.start && dateKey <= event.end;
}

function getAcademicCalendarDominantType(dayEvents) {
  const priority = {
    inicio: 0,
    feriado: 1,
    recesso: 2,
    matricula: 3,
    prazo: 4,
  };

  return dayEvents
    .map((event) => event.type)
    .sort((left, right) => (priority[left] ?? 99) - (priority[right] ?? 99))[0];
}

function renderAcademicCalendarLegend(root) {
  const legendRoot = root.querySelector('[data-academic-calendar-legend]');

  if (!legendRoot) {
    return;
  }

  legendRoot.innerHTML = academicCalendarLegendOrder.map((type) => `
    <span class="academic-calendar__legend-item">
      <span class="academic-calendar__legend-swatch academic-calendar__legend-swatch--${type}" aria-hidden="true"></span>
      <span>${academicCalendarLegendMap[type].label}</span>
    </span>
  `).join('');
}

function renderAcademicCalendarMonth(root, monthData, monthIndex, totalMonths) {
  if (!root || !monthData) {
    return;
  }

  const monthLabel = formatAcademicMonthLabel(monthData.year, monthData.month);
  const monthLabelTarget = root.querySelector('[data-academic-calendar-month-label]');
  const schoolDaysTarget = root.querySelector('[data-academic-calendar-school-days]');
  const agendaLabelTarget = root.querySelector('[data-academic-calendar-agenda-label]');
  const weekdaysTarget = root.querySelector('[data-academic-calendar-weekdays]');
  const gridTarget = root.querySelector('[data-academic-calendar-grid]');
  const eventsTarget = root.querySelector('[data-academic-calendar-events]');
  const prevButton = root.querySelector('[data-academic-calendar-prev]');
  const nextButton = root.querySelector('[data-academic-calendar-next]');

  if (monthLabelTarget) {
    monthLabelTarget.textContent = monthLabel;
  }

  if (schoolDaysTarget) {
    schoolDaysTarget.textContent = String(monthData.schoolDays);
  }

  if (agendaLabelTarget) {
    agendaLabelTarget.textContent = monthLabel;
  }

  if (prevButton) {
    prevButton.disabled = monthIndex === 0;
  }

  if (nextButton) {
    nextButton.disabled = monthIndex === totalMonths - 1;
  }

  if (weekdaysTarget && !weekdaysTarget.children.length) {
    weekdaysTarget.innerHTML = academicCalendarWeekdays.map((weekday) => `
      <span class="academic-calendar__weekday">${weekday}</span>
    `).join('');
  }

  if (gridTarget) {
    const firstDay = new Date(monthData.year, monthData.month - 1, 1, 12, 0, 0, 0);
    const monthLength = new Date(monthData.year, monthData.month, 0).getDate();
    const leadingBlanks = firstDay.getDay();
    const trailingBlanks = (7 - ((leadingBlanks + monthLength) % 7)) % 7;
    const dayCells = [];

    for (let blankIndex = 0; blankIndex < leadingBlanks; blankIndex += 1) {
      dayCells.push('<div class="academic-calendar__day academic-calendar__day--placeholder" aria-hidden="true"></div>');
    }

    for (let day = 1; day <= monthLength; day += 1) {
      const dateKey = `${monthData.key}-${String(day).padStart(2, '0')}`;
      const dayEvents = monthData.events.filter((event) => isAcademicEventOnDate(event, dateKey));
      const eventTypes = Array.from(new Set(dayEvents.map((event) => event.type)));
      const dominantType = getAcademicCalendarDominantType(dayEvents);
      const classes = ['academic-calendar__day'];
      let eventSummary = 'Sem marcação oficial';

      if (dayEvents.length) {
        classes.push('academic-calendar__day--marked');

        if (dominantType) {
          classes.push(`academic-calendar__day--${dominantType}`);
        }

        eventSummary = dayEvents.map((event) => event.title).join('; ');
      }

      dayCells.push(`
        <div
          class="${classes.join(' ')}"
          role="group"
          aria-label="${escapeHtml(`${formatAcademicDateLong(dateKey)}. ${eventSummary}`)}"
        >
          <div class="academic-calendar__day-top">
            <span class="academic-calendar__day-number">${day}</span>
            ${dayEvents.length ? `<span class="academic-calendar__day-total">${dayEvents.length}</span>` : ''}
          </div>
          <div class="academic-calendar__day-markers">
            ${eventTypes.map((type) => `<span class="academic-calendar__day-marker academic-calendar__day-marker--${type}" aria-hidden="true"></span>`).join('')}
          </div>
          <div class="academic-calendar__day-caption">${dayEvents.length ? escapeHtml(academicCalendarLegendMap[dominantType].label) : ''}</div>
        </div>
      `);
    }

    for (let blankIndex = 0; blankIndex < trailingBlanks; blankIndex += 1) {
      dayCells.push('<div class="academic-calendar__day academic-calendar__day--placeholder" aria-hidden="true"></div>');
    }

    gridTarget.innerHTML = dayCells.join('');
  }

  if (eventsTarget) {
    eventsTarget.innerHTML = monthData.events.map((event) => `
      <article class="academic-calendar__event">
        <div class="academic-calendar__event-date">${escapeHtml(formatAcademicEventDateRange(event.start, event.end))}</div>
        <div class="academic-calendar__event-copy">
          <span class="academic-calendar__event-tag academic-calendar__event-tag--${event.type}">${escapeHtml(academicCalendarLegendMap[event.type].label)}</span>
          <h4 class="academic-calendar__event-title">${escapeHtml(event.title)}</h4>
        </div>
      </article>
    `).join('');
  }
}

function mountAcademicCalendar() {
  const calendarRoot = document.querySelector('[data-academic-calendar]');

  if (!calendarRoot) {
    return;
  }

  const today = new Date();
  const todayMonthKey = buildAcademicCalendarMonthKey(today.getFullYear(), today.getMonth() + 1);
  const defaultMonthIndex = facultyAcademicCalendarMonths.findIndex((month) => month.key === todayMonthKey);
  let currentMonthIndex = defaultMonthIndex >= 0
    ? defaultMonthIndex
    : facultyAcademicCalendarMonths.findIndex((month) => month.key === '2026-03');

  if (currentMonthIndex < 0) {
    currentMonthIndex = 0;
  }

  renderAcademicCalendarLegend(calendarRoot);

  const syncCalendar = () => {
    renderAcademicCalendarMonth(
      calendarRoot,
      facultyAcademicCalendarMonths[currentMonthIndex],
      currentMonthIndex,
      facultyAcademicCalendarMonths.length,
    );
  };

  calendarRoot.querySelector('[data-academic-calendar-prev]')?.addEventListener('click', () => {
    if (currentMonthIndex === 0) {
      return;
    }

    currentMonthIndex -= 1;
    syncCalendar();
  });

  calendarRoot.querySelector('[data-academic-calendar-next]')?.addEventListener('click', () => {
    if (currentMonthIndex >= facultyAcademicCalendarMonths.length - 1) {
      return;
    }

    currentMonthIndex += 1;
    syncCalendar();
  });

  syncCalendar();
}

function readSavedSidebarState() {
  try {
    const savedState = window.localStorage.getItem(pageSidebarStorageKey);

    if (savedState === 'true' || savedState === 'false') {
      return savedState === 'true';
    }

    return window.localStorage.getItem(legacySidebarStorageKey) === 'true';
  } catch (error) {
    return false;
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

    const title = target.dataset.tooltip || '';
    const meta = target.dataset.tooltipMeta || '';

    tooltipTitle.textContent = title;
    tooltipMeta.textContent = meta;
    tooltipMeta.hidden = !meta;
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

function mountPageSidebar() {
  if (!bodyElement || !bodyElement.classList.contains('page-content')) {
    return;
  }

  const sidebarShell = document.createElement('div');
  const currentRouteMeta = currentContentRoute ? currentContentRoute.meta : 'Navegação principal do guia';

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

        <p class="page-sidebar__desc">Troque de página sem voltar para a home e mantenha o guia sempre por perto.</p>

        <div class="page-sidebar__current">
          <span class="page-sidebar__current-badge" aria-hidden="true">
            <img src="${currentRouteIcon}" alt="" class="icon-svg">
          </span>
          <div class="page-sidebar__current-copy">
            <span class="page-sidebar__group-label">Você está em</span>
            <strong class="page-sidebar__current-title">${currentRouteLabel}</strong>
            <span class="page-sidebar__current-meta">${currentRouteMeta}</span>
          </div>
        </div>

        <nav class="page-sidebar__nav" aria-label="Páginas do guia">
          <a
            href="${sidebarSpotlightRoute.href}"
            class="page-sidebar__spotlight${isCurrentContentRoute(sidebarSpotlightRoute) ? ' current' : ''}"
            data-tooltip="${sidebarSpotlightRoute.sidebarLabel}"
            data-tooltip-meta="${sidebarSpotlightRoute.meta}"
            ${isCurrentContentRoute(sidebarSpotlightRoute) ? 'aria-current="page"' : ''}
          >
            <span class="page-sidebar__spotlight-icon" aria-hidden="true">
              <img src="${sidebarSpotlightRoute.icon}" alt="" class="icon-svg">
            </span>
            <span class="page-sidebar__spotlight-copy">
              <span class="page-sidebar__spotlight-kicker">${sidebarSpotlightRoute.kicker}</span>
              <span class="page-sidebar__spotlight-title">${sidebarSpotlightRoute.sidebarLabel}</span>
              <span class="page-sidebar__spotlight-desc">${sidebarSpotlightRoute.meta}</span>
            </span>
            <span class="page-sidebar__spotlight-cta">${sidebarSpotlightRoute.cta}</span>
          </a>

          <div class="page-sidebar__group">
            <div class="page-sidebar__group-label">Começo do curso</div>
            <div class="page-sidebar__links">
              ${contentPagePrimaryRoutes.map((route) => {
                const isCurrent = isCurrentContentRoute(route);
                const currentClass = isCurrent ? ' current' : '';
                const currentAttribute = isCurrent ? ' aria-current="page"' : '';

                return `
                  <a
                    href="${route.href}"
                    class="page-sidebar__link${currentClass}"
                    data-tooltip="${route.sidebarLabel || route.label}"
                    data-tooltip-meta="${route.meta}"
                    ${currentAttribute}
                  >
                    <span class="page-sidebar__icon" aria-hidden="true">
                      <img src="${route.icon}" alt="" class="icon-svg">
                    </span>
                    <span class="page-sidebar__link-copy">
                      <span class="page-sidebar__link-title">${route.sidebarLabel || route.label}</span>
                      <span class="page-sidebar__link-meta">${route.meta}</span>
                    </span>
                  </a>
                `;
              }).join('')}
            </div>
          </div>

          <div class="page-sidebar__group">
            <div class="page-sidebar__group-label">Rede, oportunidades e projeto</div>
            <div class="page-sidebar__links">
              ${contentPageSecondaryRoutes.map((route) => {
                const isCurrent = isCurrentContentRoute(route);
                const currentClass = isCurrent ? ' current' : '';
                const currentAttribute = isCurrent ? ' aria-current="page"' : '';

                return `
                  <a
                    href="${route.href}"
                    class="page-sidebar__link${currentClass}"
                    data-tooltip="${route.sidebarLabel || route.label}"
                    data-tooltip-meta="${route.meta}"
                    ${currentAttribute}
                  >
                    <span class="page-sidebar__icon" aria-hidden="true">
                      <img src="${route.icon}" alt="" class="icon-svg">
                    </span>
                    <span class="page-sidebar__link-copy">
                      <span class="page-sidebar__link-title">${route.sidebarLabel || route.label}</span>
                      <span class="page-sidebar__link-meta">${route.meta}</span>
                    </span>
                  </a>
                `;
              }).join('')}
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

  let pageSidebarCollapsed = readSavedSidebarState();
  let pageSidebarOpen = false;

  const syncPageSidebar = () => {
    const isCompact = compactSidebarQuery.matches;

    bodyElement.classList.toggle('page-sidebar-collapsed', !isCompact && pageSidebarCollapsed);
    bodyElement.classList.toggle('page-sidebar-open', isCompact && pageSidebarOpen);

    pageSidebar?.setAttribute('aria-hidden', String(isCompact && !pageSidebarOpen));

    if (pageSidebarToggle) {
      const expanded = isCompact ? pageSidebarOpen : !pageSidebarCollapsed;
      pageSidebarToggle.setAttribute('aria-expanded', String(expanded));
      pageSidebarToggle.setAttribute(
        'aria-label',
        isCompact
          ? (pageSidebarOpen ? 'Fechar atalhos' : 'Abrir atalhos')
          : (pageSidebarCollapsed ? 'Expandir atalhos' : 'Recolher atalhos'),
      );
    }

    if (pageSidebarMobileTrigger) {
      pageSidebarMobileTrigger.setAttribute('aria-expanded', String(isCompact && pageSidebarOpen));
    }

    if (pageSidebarBackdrop) {
      pageSidebarBackdrop.hidden = !(isCompact && pageSidebarOpen);
    }

    syncSidebarTooltips();
  };

  const togglePageSidebar = () => {
    if (compactSidebarQuery.matches) {
      pageSidebarOpen = !pageSidebarOpen;
    } else {
      pageSidebarCollapsed = !pageSidebarCollapsed;
      persistSidebarState(pageSidebarCollapsed);
    }

    syncPageSidebar();
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
    });
  } else if (typeof compactSidebarQuery.addListener === 'function') {
    compactSidebarQuery.addListener(() => {
      pageSidebarOpen = false;
      syncPageSidebar();
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

function slugifyValue(value) {
  return normalizeSearchValue(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureSearchTargetId(element, fallback) {
  if (!element) {
    return '';
  }

  if (!element.id) {
    element.id = `page-search-${fallback}`;
  }

  return element.id;
}

function resolveSearchTarget(element) {
  const elementWithId = element.closest('.section-block[id], .callout-panel[id], .page-hero[id], .hero-panel[id], article[id], a[id], figure[id], section[id], div[id]');

  if (elementWithId) {
    return elementWithId;
  }

  return element.closest('.section-block, .callout-panel, .page-hero, .hero-panel, article, a, figure, section, div') || element;
}

function getSearchTitle(element, fallbackText) {
  const titleElement = element.querySelector(
    '.page-title, .section-title, .card-title, .photo-title, .link-title, .hero-panel-title, .timeline-card__title, .faq-card__title, .quick-link-title, .glossary-term'
  );

  if (titleElement) {
    return condenseText(titleElement.textContent);
  }

  return condenseText(fallbackText).slice(0, 96);
}

function getSearchSnippet(element) {
  const snippetElement = element.querySelector(
    '.page-intro, .section-text, .card-text, .photo-text, .link-text, .hero-panel-list, .timeline-card__text, .faq-card__text, .quick-link-meta, .glossary-desc, p, li'
  );

  if (!snippetElement) {
    return '';
  }

  return condenseText(snippetElement.textContent).slice(0, 180);
}

function getSearchContext(element) {
  const container = element.closest('.section-block, .callout-panel, .page-hero, .hero-panel');
  const containerTitle = container?.querySelector('.section-title, .page-title, .hero-panel-title');
  const contextTitle = containerTitle ? condenseText(containerTitle.textContent) : currentRouteLabel;

  if (element.classList.contains('section-block') || element.classList.contains('callout-panel') || element.classList.contains('page-hero') || element.classList.contains('hero-panel')) {
    return {
      eyebrow: 'Nesta página',
      meta: currentRouteLabel,
    };
  }

  return {
    eyebrow: 'Conteúdo',
    meta: contextTitle || currentRouteLabel,
  };
}

function getSearchSnippetPreview(text, queryTokens) {
  const plainText = condenseText(text);

  if (!plainText) {
    return '';
  }

  if (!queryTokens.length) {
    return plainText.slice(0, 140);
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
    return plainText.slice(0, 140);
  }

  const previewStart = Math.max(0, firstMatchIndex - 36);
  const previewEnd = Math.min(plainText.length, previewStart + 156);
  const preview = plainText.slice(previewStart, previewEnd).trim();

  return `${previewStart > 0 ? '…' : ''}${preview}${previewEnd < plainText.length ? '…' : ''}`;
}

function scoreSearchEntry(entry, query) {
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
    score += 140;
  }

  if (hasIncludesSearchVariant(entry.metaSearchValue, exactNeedles) || (normalized && entry.metaValue.includes(normalized))) {
    score += 60;
  }

  if (hasIncludesSearchVariant(entry.textSearchValue, exactNeedles) || (normalized && entry.textValue.includes(normalized))) {
    score += 80;
  }

  if (entry.kind === 'section') {
    score += 28;
  } else if (entry.kind === 'content') {
    score += 24;
  } else if (entry.kind === 'page') {
    score += 12;
  }

  tokens.forEach((token) => {
    if (entry.titleSearchValue.startsWith(token) || entry.titleVariants.some((variant) => variant.startsWith(token))) {
      score += 42;
    } else if (entry.titleSearchValue.includes(token)) {
      score += 26;
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

function buildPageSearchIndex() {
  const entries = [];
  const entryKeys = new Set();

  contentPageRoutes
    .filter((route) => route.file !== currentContentPage)
    .forEach((route) => {
      const title = route.sidebarLabel || route.label;
      const fullText = `${route.label} ${title} ${route.meta}`;
      const entry = {
        kind: 'page',
        eyebrow: 'Página',
        title,
        meta: route.meta,
        snippet: route.meta,
        href: route.href,
        titleValue: normalizeSearchValue(title),
        titleVariants: buildSearchVariants(title),
        titleSearchValue: buildSearchHaystack(title),
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

  if (!pageMain) {
    return entries;
  }

  const searchableSelectors = [
    '.page-hero',
    '.section-block',
    '.hero-panel',
    '.callout-panel',
    '.info-card',
    '.link-card',
    '.photo-card',
    '.material-card',
    '.timeline-card',
    '.faq-card',
    '.stat-card',
    '.mat-card',
    '.index-link',
    '.index-spotlight',
    '.quick-link',
  ];

  Array.from(pageMain.querySelectorAll(searchableSelectors.join(', '))).forEach((element, index) => {
    const fullText = condenseText(element.textContent);

    if (!fullText || fullText.length < 12) {
      return;
    }

    const title = getSearchTitle(element, fullText);
    const snippet = getSearchSnippet(element) || fullText.slice(0, 180);
    const context = getSearchContext(element);
    const target = resolveSearchTarget(element);
    const targetId = ensureSearchTargetId(target, `${slugifyValue(title || context.meta || 'item') || 'item'}-${index + 1}`);
    const entry = {
      kind: element.classList.contains('section-block') || element.classList.contains('callout-panel') || element.classList.contains('page-hero')
        ? 'section'
        : 'content',
      eyebrow: context.eyebrow,
      title,
      meta: context.meta,
      snippet,
      targetId,
      titleValue: normalizeSearchValue(title),
      titleVariants: buildSearchVariants(title),
      titleSearchValue: buildSearchHaystack(title),
      metaValue: normalizeSearchValue(context.meta),
      metaSearchValue: buildSearchHaystack(context.meta),
      textValue: normalizeSearchValue(fullText),
      textSearchValue: buildSearchHaystack(fullText),
      searchValue: buildSearchHaystack(title, context.meta, snippet, fullText),
    };
    const entryKey = `${entry.kind}:${entry.targetId}:${entry.title}`;

    if (!entryKeys.has(entryKey)) {
      entryKeys.add(entryKey);
      entries.push(entry);
    }
  });

  return entries;
}

function mountPageSearch() {
  if (!bodyElement || !bodyElement.classList.contains('page-content')) {
    return;
  }

  const header = document.querySelector('.site-topbar');

  if (!header) {
    return;
  }

  const searchShell = document.createElement('div');
  searchShell.className = 'site-topbar__search';
  searchShell.innerHTML = `
    <div class="page-search page-search--topbar">
      <div class="page-search__field">
        <span class="page-search__icon" aria-hidden="true"></span>
        <input
          type="search"
          class="page-search__input"
          id="page-search-input"
          placeholder="Buscar nesta página ou no HELPIEEE"
          autocomplete="off"
          spellcheck="false"
        >
        <button type="button" class="page-search__clear" id="page-search-clear" hidden>Limpar</button>
      </div>
      <div class="page-search-results" id="page-search-results" hidden></div>
    </div>
  `;

  if (topbarNav) {
    header.insertBefore(searchShell, topbarNav);
  } else {
    header.appendChild(searchShell);
  }

  const searchInput = searchShell.querySelector('.page-search__input');
  const searchClear = searchShell.querySelector('.page-search__clear');
  const searchResults = searchShell.querySelector('.page-search-results');
  const searchIndex = buildPageSearchIndex();
  let activeResults = [];
  let activeResultIndex = -1;

  const syncActiveResult = () => {
    searchResults.querySelectorAll('.page-search-result[data-search-index]').forEach((button) => {
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
    flashSearchTarget(result.targetId);
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
        score: scoreSearchEntry(entry, query),
      }))
      .filter((entry) => entry.score >= 0)
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'pt-BR'))
      .slice(0, 8)
      .map((entry) => ({
        ...entry,
        preview: getSearchSnippetPreview(entry.snippet || entry.meta, queryTokens),
      }));

    if (!activeResults.length) {
      activeResultIndex = -1;
      searchResults.hidden = false;
      searchResults.innerHTML = `
        <div class="page-search-results__empty">
          Nenhum resultado encontrado. Tente outra palavra-chave.
        </div>
      `;
      return;
    }

    activeResultIndex = 0;
    searchResults.hidden = false;
    searchResults.innerHTML = activeResults.map((result, index) => `
      <button type="button" class="page-search-result${index === activeResultIndex ? ' is-active' : ''}" data-search-index="${index}">
        <span class="page-search-result__eyebrow">${escapeHtml(result.eyebrow)}</span>
        <span class="page-search-result__title">${escapeHtml(result.title)}</span>
        <span class="page-search-result__meta">${escapeHtml(result.meta)}</span>
        <span class="page-search-result__snippet">${escapeHtml(result.preview)}</span>
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

mountAcademicCalendar();
mountPageSidebar();
mountPageSearch();

const contentPageReveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const contentPageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  contentPageReveals.forEach((item) => contentPageObserver.observe(item));
} else {
  contentPageReveals.forEach((item) => item.classList.add('visible'));
}

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

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});
