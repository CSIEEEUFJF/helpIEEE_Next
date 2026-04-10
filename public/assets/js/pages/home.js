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
