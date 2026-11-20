'use client';

import { useEffect } from 'react';

export default function ZoomController() {
  useEffect(() => {
    // Ne jamais appliquer de zoom sur mobile ou tablette :
    // Évite le reflow forcé (layout thrashing) et préserve l'échelle tactile native
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 1024 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) {
      if (document.documentElement.style.zoom) {
        document.documentElement.style.removeProperty('zoom');
      }
      return;
    }

    // Fonction qui ajuste le zoom CSS sur grand écran desktop sans bloquer le rendu
    const adjustZoom = () => {
      if (window.innerWidth < 1024) {
        if (document.documentElement.style.zoom) {
          document.documentElement.style.removeProperty('zoom');
        }
        return;
      }

      let browserZoom = 1;
      if (window.outerWidth && window.innerWidth) {
        browserZoom = window.outerWidth / window.innerWidth;
      }

      const isOver100 = browserZoom > 1.05;
      const isUnder90 = browserZoom < 0.88;
      const root = document.documentElement;

      if (isOver100 || isUnder90) {
        if (root.style.zoom) {
          root.style.removeProperty('zoom');
        }
      } else {
        if (root.style.zoom !== '0.9') {
          root.style.zoom = '0.9';
        }
      }
    };

    // Découpler avec requestAnimationFrame pour éviter les ajustements forcés au montage
    const rafId = requestAnimationFrame(adjustZoom);

    window.addEventListener('resize', adjustZoom, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', adjustZoom);
    };
  }, []);

  return null;
}

