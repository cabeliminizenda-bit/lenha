'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CookieConsent() {
  const t = useTranslations('CookieConsent');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small timeout for smooth appearance after initial paint
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
    window.dispatchEvent(new Event('cookie_consent_accepted'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div 
      role="dialog"
      aria-live="polite"
      aria-label={t('title')}
      className="fixed bottom-[68px] sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-[80] bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xl shadow-stone-900/15 p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
            {t('title')}
          </h3>
        </div>
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Fechar"
          className="text-stone-400 hover:text-stone-600 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed mt-2.5">
        {t('message')}
      </p>

      <div className="mt-2">
        <Link 
          href="/privacidade" 
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-red-600 underline transition-colors"
        >
          <span>{t('privacy_policy')}</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5 mt-3.5 pt-3 border-t border-stone-100">
        <button
          type="button"
          onClick={handleDecline}
          className="flex-1 py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors text-center"
        >
          {t('decline')}
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all text-center"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
