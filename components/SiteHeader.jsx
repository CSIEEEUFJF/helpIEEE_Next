import Link from 'next/link';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PRIMARY_CTA, SITE_NAVIGATION } from '@/components/siteNavigation';

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo principal
      </a>

      <header className="site-header">
        <div className="site-header__institutional">
          <div className="site-container site-header__institutional-inner">
            <span>Um projeto feito por estudantes para estudantes</span>
            <a
              className="site-header__institutional-link"
              href="https://www.ieeeufjf.com.br/"
              target="_blank"
              rel="noreferrer"
            >
              Ramo Estudantil IEEE UFJF
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        <div className="site-header__main">
          <div className="site-container site-header__main-inner">
            <Link className="site-brand" href="/" aria-label="HELPIEEE — página inicial">
              <span className="site-brand__name" aria-hidden="true">
                <span className="site-brand__help">HELP</span>
                <span className="site-brand__ieee">IEEE</span>
              </span>
              <span className="site-brand__descriptor">Guia do calouro UFJF</span>
            </Link>

            <nav className="site-header__navigation" aria-label="Navegação principal">
              <ul className="site-header__navigation-list">
                {SITE_NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link className="site-header__navigation-link" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="site-header__actions">
              <ThemeToggle className="site-header__theme-toggle" />
              <Link className="button button--primary site-header__cta" href={PRIMARY_CTA.href}>
                {PRIMARY_CTA.label}
              </Link>
              <MobileNavigation />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
