import Link from 'next/link';
import { SITE_NAVIGATION } from '@/components/siteNavigation';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-container site-footer__grid">
        <div className="site-footer__brand-column">
          <Link className="site-brand site-brand--footer" href="/" aria-label="HELPIEEE — página inicial">
            <span className="site-brand__name" aria-hidden="true">
              <span className="site-brand__help">HELP</span>
              <span className="site-brand__ieee">IEEE</span>
            </span>
            <span className="site-brand__descriptor">Guia do calouro UFJF</span>
          </Link>
          <p className="site-footer__summary">
            Um ponto de partida para calouros de exatas e engenharias encontrarem
            informações confiáveis e viverem melhor a universidade.
          </p>
        </div>

        <nav className="site-footer__navigation" aria-labelledby="footer-navigation-title">
          <h2 className="site-footer__title" id="footer-navigation-title">Explore</h2>
          <ul className="site-footer__link-list">
            {SITE_NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="site-footer__ieee" aria-labelledby="footer-ieee-title">
          <h2 className="site-footer__title" id="footer-ieee-title">IEEE UFJF</h2>
          <p>
            O HELPIEEE é uma iniciativa do Ramo Estudantil IEEE da Universidade
            Federal de Juiz de Fora.
          </p>
          <a
            className="site-footer__text-link"
            href="https://www.ieeeufjf.com.br/"
            target="_blank"
            rel="noreferrer"
          >
            Visite o site do Ramo
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>

      <div className="site-footer__bottom">
        <div className="site-container site-footer__bottom-inner">
          <p>© {currentYear} Ramo Estudantil IEEE UFJF.</p>
          <p>Feito em Juiz de Fora, por estudantes.</p>
        </div>
      </div>
    </footer>
  );
}
