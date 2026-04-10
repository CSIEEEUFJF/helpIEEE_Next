const currentContentPage = window.location.pathname.split('/').pop().split('?')[0];

const contentPageRoutes = [
  { href: '../index.html', label: 'Início', file: 'index.html', theme: 'theme-branch', meta: 'Visão geral' },
  { href: 'primeiros-passos.html', label: 'Começar', file: 'primeiros-passos.html', theme: 'theme-branch', meta: 'Internet, RU e labs' },
  { href: 'faculdade.html', label: 'Faculdade', file: 'faculdade.html', theme: 'theme-ias', meta: 'SIGA, RAG e IRA' },
  { href: 'materiais.html', label: 'Materiais', file: 'materiais.html', theme: 'theme-pes', meta: 'Biblioteca do 1º período', matchPrefix: 'materiais-' },
  { href: 'mapa.html', label: 'Mapa', file: 'mapa.html', theme: 'theme-vts', meta: 'Salas e blocos' },
  { href: 'comunidade.html', label: 'Comunidade', file: 'comunidade.html', theme: 'theme-sight', meta: 'Integração e apoio' },
  { href: 'ieee.html', label: 'IEEE', file: 'ieee.html', theme: 'theme-wie', meta: 'Capítulos do ramo' },
  { href: 'fluxo.html', label: 'Fluxo', file: 'fluxo.html', theme: 'theme-aess', meta: 'Pré-requisitos' },
];

const isCurrentContentRoute = (route) => {
  if (route.matchPrefix) {
    return currentContentPage === route.file || currentContentPage.startsWith(route.matchPrefix);
  }

  return route.file === currentContentPage;
};

const topbarNav = document.querySelector('.topbar-nav');
const currentContentRoute = contentPageRoutes.find((route) => isCurrentContentRoute(route));

if (topbarNav) {
  topbarNav.innerHTML = contentPageRoutes.map((route) => {
    const currentAttribute = isCurrentContentRoute(route) ? ' aria-current="page"' : '';
    return `<a href="${route.href}" class="topbar-link"${currentAttribute}>${route.label}</a>`;
  }).join('');
}

const pageHero = document.querySelector('.page-hero');

if (pageHero) {
  const quickAccessId = 'quick-access-grid';
  const currentRouteLabel = currentContentRoute ? currentContentRoute.label : 'Esta página';
  const quickAccessPanel = document.createElement('section');
  quickAccessPanel.className = 'quick-access-panel reveal';
  quickAccessPanel.innerHTML = `
    <div class="quick-access-head">
      <div class="quick-access-copy">
        <div class="section-kicker">Atalhos entre páginas</div>
        <h2 class="quick-access-title">Pule direto para a parte do guia que faz sentido para você agora.</h2>
        <p class="quick-access-summary">Continue pelo guia sem voltar para a home e abra outra área só quando realmente precisar.</p>
      </div>
      <div class="quick-access-actions">
        <a href="../index.html#indice" class="quick-access-home">Ver índice completo na home</a>
        <button class="quick-access-toggle" type="button" aria-expanded="false" aria-controls="${quickAccessId}" hidden>Abrir páginas</button>
      </div>
    </div>
    <div class="quick-access-mobile-current">
      <span class="quick-access-mobile-label">Você está em</span>
      <span class="quick-access-mobile-page">${currentRouteLabel}</span>
    </div>
    <div class="quick-access-grid" id="${quickAccessId}">
      ${contentPageRoutes
        .filter((route) => route.file !== 'index.html')
        .map((route) => {
          const currentClass = isCurrentContentRoute(route) ? ' current' : '';
          const currentAttribute = isCurrentContentRoute(route) ? ' aria-current="page"' : '';
          return `
            <a href="${route.href}" class="quick-link ${route.theme}${currentClass}"${currentAttribute}>
              <span class="quick-link-label">${route.label}</span>
              <span class="quick-link-meta">${route.meta}</span>
            </a>
          `;
        }).join('')}
    </div>
  `;

  pageHero.insertAdjacentElement('afterend', quickAccessPanel);

  const quickAccessToggle = quickAccessPanel.querySelector('.quick-access-toggle');
  const quickAccessGrid = quickAccessPanel.querySelector('.quick-access-grid');
  const compactQuickAccessQuery = window.matchMedia('(max-width: 720px)');
  let quickAccessOpen = false;

  const syncQuickAccessPanel = () => {
    const isCompact = compactQuickAccessQuery.matches;
    quickAccessPanel.classList.toggle('is-compact', isCompact);

    if (!quickAccessToggle || !quickAccessGrid) {
      return;
    }

    if (isCompact) {
      quickAccessToggle.hidden = false;
      quickAccessGrid.hidden = !quickAccessOpen;
      quickAccessToggle.setAttribute('aria-expanded', String(quickAccessOpen));
      quickAccessToggle.textContent = quickAccessOpen ? 'Ocultar páginas' : 'Abrir páginas';
      return;
    }

    quickAccessToggle.hidden = true;
    quickAccessGrid.hidden = false;
    quickAccessToggle.setAttribute('aria-expanded', 'true');
  };

  if (quickAccessToggle && quickAccessGrid) {
    quickAccessToggle.addEventListener('click', () => {
      quickAccessOpen = !quickAccessOpen;
      syncQuickAccessPanel();
    });

    if (typeof compactQuickAccessQuery.addEventListener === 'function') {
      compactQuickAccessQuery.addEventListener('change', syncQuickAccessPanel);
    } else if (typeof compactQuickAccessQuery.addListener === 'function') {
      compactQuickAccessQuery.addListener(syncQuickAccessPanel);
    }

    syncQuickAccessPanel();
  }
}

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
