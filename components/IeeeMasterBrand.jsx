'use client';

import Image from 'next/image';
import { useSyncExternalStore } from 'react';

const IEEE_BLUE_TONE = 'ieee-blue';
const DARK_THEME = 'dark';

function getShouldUseWhiteBrand() {
  if (typeof document === 'undefined') return false;

  const header = document.querySelector('.site-header');
  const isBlueHeader = header?.dataset.tone === IEEE_BLUE_TONE;
  const isDarkTheme = document.documentElement.dataset.theme === DARK_THEME;

  return isBlueHeader || isDarkTheme;
}

function subscribeToBrandContext(callback) {
  const header = document.querySelector('.site-header');
  const root = document.documentElement;
  const observer = new MutationObserver(callback);

  observer.observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  if (header) {
    observer.observe(header, {
      attributes: true,
      attributeFilter: ['data-tone'],
    });
  }

  return () => observer.disconnect();
}

function getServerBrandContext() {
  return false;
}

export function IeeeMasterBrand() {
  const shouldUseWhiteBrand = useSyncExternalStore(
    subscribeToBrandContext,
    getShouldUseWhiteBrand,
    getServerBrandContext,
  );

  const source = shouldUseWhiteBrand
    ? '/assets/images/branding/ieee-master-brand-white.png'
    : '/assets/images/branding/ieee-master-brand-black.png';

  return (
    <a
      className="site-header__ieee-master-brand"
      href="https://www.ieee.org/"
      aria-label="IEEE"
    >
      <Image
        className="site-header__ieee-master-brand-image"
        src={source}
        alt="IEEE"
        width={113}
        height={33}
      />
    </a>
  );
}
