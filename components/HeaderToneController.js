'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { shouldUseIeeeBlueHeader } from '@/lib/header-tone';

const IEEE_BLUE_TONE = 'ieee-blue';

function setHeaderTone(header, useIeeeBlue) {
  if (useIeeeBlue) {
    header.dataset.tone = IEEE_BLUE_TONE;
    return;
  }

  delete header.dataset.tone;
}

export function HeaderToneController() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector('.site-header');
    const splash = document.querySelector('[data-header-splash]');

    if (!header) return undefined;

    if (!splash) {
      function updateToneOnScroll() {
        setHeaderTone(
          header,
          shouldUseIeeeBlueHeader({
            hasSplash: false,
            scrollY: window.scrollY,
          }),
        );
      }

      updateToneOnScroll();
      window.addEventListener('scroll', updateToneOnScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', updateToneOnScroll);
        setHeaderTone(header, false);
      };
    }

    let observer;
    let resizeObserver;

    function observeSplash() {
      observer?.disconnect();

      const headerHeight = Math.ceil(header.getBoundingClientRect().height);
      const splashRect = splash.getBoundingClientRect();
      const isSplashIntersecting =
        splashRect.bottom > headerHeight && splashRect.top < window.innerHeight;

      setHeaderTone(
        header,
        shouldUseIeeeBlueHeader({
          hasSplash: true,
          headerHeight,
          isIntersecting: isSplashIntersecting,
          splashBottom: splashRect.bottom,
        }),
      );

      observer = new IntersectionObserver(
        ([entry]) => {
          setHeaderTone(
            header,
            shouldUseIeeeBlueHeader({
              hasSplash: true,
              headerHeight,
              isIntersecting: entry.isIntersecting,
              splashBottom: entry.boundingClientRect.bottom,
            }),
          );
        },
        {
          rootMargin: `-${headerHeight}px 0px 0px 0px`,
          threshold: 0,
        },
      );
      observer.observe(splash);
    }

    observeSplash();

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(observeSplash);
      resizeObserver.observe(header);
    } else {
      window.addEventListener('resize', observeSplash, { passive: true });
    }

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', observeSplash);
      setHeaderTone(header, false);
    };
  }, [pathname]);

  return null;
}
