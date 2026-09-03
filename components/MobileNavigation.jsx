'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { PRIMARY_CTA, SITE_NAVIGATION } from '@/components/siteNavigation';

function isCurrentPage(pathname, href) {
  if (href === '/' || href === '/guia') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation() {
  const [openForPath, setOpenForPath] = useState(null);
  const pathname = usePathname();
  const isOpen = openForPath === pathname;
  const menuId = useId();
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;

      setOpenForPath(null);
      triggerRef.current?.focus();
    }

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpenForPath(null);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div className="mobile-navigation" ref={containerRef}>
      <button
        className="mobile-navigation__trigger"
        type="button"
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? 'Fechar menu principal' : 'Abrir menu principal'}
        onClick={() => setOpenForPath((openPath) => (
          openPath === pathname ? null : pathname
        ))}
      >
        <span className="mobile-navigation__icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        className="mobile-navigation__panel"
        id={menuId}
        hidden={!isOpen}
      >
        <nav aria-label="Navegação principal em dispositivos móveis">
          <ul className="mobile-navigation__list">
            {SITE_NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link
                  className="mobile-navigation__link"
                  href={item.href}
                  aria-current={isCurrentPage(pathname, item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="button button--primary mobile-navigation__cta" href={PRIMARY_CTA.href}>
            {PRIMARY_CTA.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
