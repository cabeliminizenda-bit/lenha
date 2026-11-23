'use client';

import { useEffect } from 'react';

/**
 * ZoomController: Cleans up any legacy inline zoom styles without modifying
 * the root DOM geometry, preventing layout thrashing and preserving native browser scaling & LCP.
 */
export default function ZoomController() {
  useEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement.style.zoom) {
      document.documentElement.style.removeProperty('zoom');
    }
  }, []);

  return null;
}
