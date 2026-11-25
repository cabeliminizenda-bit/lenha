'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });

export default function DeferredWidgets({
  chatEnabled,
  chatStoreName,
  chatStoreIcon,
}: {
  chatEnabled: boolean;
  chatStoreName: string;
  chatStoreIcon: string;
}) {
  useEffect(() => {
    // Automatically eliminate Netlify HUD / "Powered by Netlify" badge on client
    const removeNetlifyBadge = () => {
      document.querySelectorAll('iframe').forEach(el => {
        if (
          el.style.zIndex === '2147483645' || 
          (el.getAttribute('style') && el.getAttribute('style')!.includes('2147483645')) ||
          (el.srcdoc && el.srcdoc.includes('nl-wrap'))
        ) {
          el.remove();
        }
      });
      document.querySelectorAll('script[src*="netlify/scripts/hud"]').forEach(s => s.remove());
    };

    removeNetlifyBadge();
    const observer = new MutationObserver(removeNetlifyBadge);
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ChatWidget
        enabled={chatEnabled}
        storeName={chatStoreName}
        storeIcon={chatStoreIcon}
      />
      <BackToTop />
    </>
  );
} 
