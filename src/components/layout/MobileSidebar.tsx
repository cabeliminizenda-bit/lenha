'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  logoImage?: string;
  logoHeight?: string;
  aboutTitle?: string;
  aboutDesc?: string;
  menuLinks?: Array<{ label: string, url: string }>;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  categories?: Array<{ id: string, name: string, slug: string | null }>;
};

const defaultCategories = [
  { name: 'Pellets & Lenha', slug: 'combustiveis', icon: '🪵' },
  { name: 'Salamandras', slug: 'salamandras', icon: '🔥' },
  { name: 'Recuperadores de Calor', slug: 'recuperadores-de-calor', icon: '🏠' },
  { name: 'Fogões a Lenha', slug: 'fogoes-a-lenha', icon: '🍳' },
  { name: 'Climatização & AC', slug: 'climatizacao', icon: '❄️' },
  { name: 'Termoacumuladores', slug: 'termoacumuladores', icon: '💧' },
  { name: 'Fornos a Lenha', slug: 'fornos-a-lenha', icon: '🍕' },
];

export default function MobileSidebar({
  isOpen,
  onClose,
  logoImage,
  logoHeight = '64',
  aboutTitle,
  aboutDesc,
  menuLinks = [],
  contactAddress = 'Alto Almosquia, 2750-000 Cascais – Portugal',
  contactPhone = '+351 253 000 000',
  contactEmail = 'info@lenhaecarvaosilvadias.com',
  categories = [],
}: MobileSidebarProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="fixed inset-0 z-[100] flex lg:hidden">
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar Panel */}
      <div className="relative w-[86%] max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300 z-10">
        
        {/* Top Header: Logo + Close Button */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <Link href="/" onClick={onClose} className="block">
            {logoImage && logoImage !== '/logo.png' && logoImage !== '/logo.jpg' ? (
              <Image 
                src={logoImage} 
                alt="Silva Dias" 
                width={190} 
                height={60} 
                className="object-contain" 
                style={{ width: 'auto', height: `${logoHeight}px` }} 
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <Image src="/logo-flame.png" alt="Silva Dias" width={32} height={52} className="h-8 w-auto object-contain shrink-0" />
                <div>
                  <span className="font-extrabold text-base tracking-tight text-stone-900 block leading-tight">LENHA &amp; CARVÃO</span>
                  <span className="text-[10px] font-bold tracking-wider text-red-600 uppercase block">SILVA DIAS</span>
                </div>
              </div>
            )}
          </Link>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="w-9 h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-200 border border-stone-200 rounded-full transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick User Utilities Row */}
        <div className="grid grid-cols-2 gap-2 p-3.5 bg-stone-100/80 border-b border-stone-200">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-800 hover:border-red-400 hover:text-red-600 transition shadow-xs"
          >
            <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">Minha Conta</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              cartStore.setIsOpen(true);
            }}
            className="flex items-center justify-between p-2 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-800 hover:border-red-400 hover:text-red-600 transition shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Carrinho</span>
            </span>
            {mounted && cartStore.getTotalItems() > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {cartStore.getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="p-3.5 flex-1 divide-y divide-stone-100">
          {/* Main Links */}
          <ul className="space-y-1 pb-3">
            <li>
              <Link 
                href="/"
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-stone-800 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
              >
                <span>Início</span>
                <span className="text-stone-400 text-xs">&rarr;</span>
              </Link>
            </li>

            <li>
              <Link 
                href="/shop"
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-stone-800 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded uppercase">Catálogo</span>
                  <span>Ver Loja Completa</span>
                </span>
                <span className="text-stone-400 text-xs">&rarr;</span>
              </Link>
            </li>

            {/* Categories Accordion */}
            <li>
              <button 
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-stone-900 bg-stone-100/90 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors cursor-pointer mt-1"
              >
                <span className="flex items-center gap-2">
                  <span>📂</span>
                  <span>Categorias de Produtos</span>
                </span>
                <svg className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoriesOpen && (
                <ul className="mt-1 ml-2 space-y-1 border-l-2 border-red-500/30 pl-2 py-1">
                  {displayCategories.map((cat: any, idx: number) => (
                    <li key={cat.id || idx}>
                      <Link 
                        href={`/product-category/${cat.slug || cat.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {cat.icon && <span>{cat.icon}</span>}
                          <span>{cat.name}</span>
                        </span>
                        <svg className="w-3 h-3 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Custom or Fallback Links */}
            {menuLinks && menuLinks.length > 0 ? (
              menuLinks.map((link, idx) => (
                <li key={`menu-${idx}`}>
                  <Link 
                    href={link.url}
                    onClick={onClose}
                    className="block px-3.5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li>
                  <Link 
                    href="/order-tracking"
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span>Rastrear Encomenda</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/devolucoes"
                    onClick={onClose}
                    className="block px-3.5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                  >
                    Devolução e Reembolso
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/envios-e-entregas"
                    onClick={onClose}
                    className="block px-3.5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                  >
                    Expedição e Entrega com Plataforma
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact"
                    onClick={onClose}
                    className="block px-3.5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                  >
                    Contactar Apoio ao Cliente
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Contact & Support Details at the bottom */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 mt-auto text-xs space-y-2.5">
          <p className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Apoio ao Cliente</p>
          {contactPhone && (
            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-stone-600 hover:text-red-600 transition">
              <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{contactPhone}</span>
            </a>
          )}
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-stone-600 hover:text-red-600 transition truncate">
              <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{contactEmail}</span>
            </a>
          )}
          {contactAddress && (
            <p className="flex items-start gap-2 text-stone-500 pt-1 border-t border-stone-200/60 text-[11px] leading-tight">
              <span>📍</span>
              <span>{contactAddress}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
