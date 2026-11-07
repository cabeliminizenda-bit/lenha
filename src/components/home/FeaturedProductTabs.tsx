'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  discountLabel?: string | null;
  categorySlug?: string;
  categoryName?: string;
  allCategories?: string;
}

interface FeaturedProductTabsProps {
  initialProducts?: ProductItem[];
}

// Resilient fallback products with verified Cloudinary images from Silva Dias catalog
const fallbackProducts: ProductItem[] = [
  {
    id: 'fb-p1',
    title: 'Pellets Para Estufa Palet 77 Sacos De 15 Kg (1155kg)',
    slug: 'pellets-para-estufa-palet-77-sacos-15kg',
    price: 550.00,
    compareAtPrice: 590.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794069048/lenha/woocommerce-import/nhemnuopqbcehe1hoozw.jpg'],
    discountLabel: 'Top Vendas',
    categorySlug: 'pellets',
    categoryName: 'Pellets & Lenha',
    allCategories: 'pellets pellets-e-lenha combustiveis'
  },
  {
    id: 'fb-p2',
    title: 'Palete 48 sacos de lenha Popular Parfer 150',
    slug: 'palete-48-sacos-lenha-popular-parfer',
    price: 150.00,
    compareAtPrice: 175.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794069058/lenha/woocommerce-import/mzx0ucldxrmtcnwoe7pe.jpg'],
    discountLabel: 'Promoção',
    categorySlug: 'lenha-e-pellets',
    categoryName: 'Pellets & Lenha',
    allCategories: 'lenha lenha-e-pellets combustiveis'
  },
  {
    id: 'fb-p3',
    title: 'Palete de Lenha de Sobro +- 500 Kg Pronta a Queimar',
    slug: 'palete-lenha-sobro-500kg',
    price: 199.00,
    compareAtPrice: 230.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794069072/lenha/woocommerce-import/uew0ltmcqaulf0z9cgyi.jpg'],
    discountLabel: 'Stock Limitado',
    categorySlug: 'combustiveis',
    categoryName: 'Pellets & Lenha',
    allCategories: 'combustiveis lenha pellets-e-lenha'
  },
  {
    id: 'fb-p4',
    title: 'Fogão a Lenha Frontal M-300 TFK',
    slug: 'fogao-a-lenha-frontal-m-300-tfk',
    price: 1090.00,
    compareAtPrice: 1290.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794069904/lenha/woocommerce-import/rgvkzaiphxkaibnnicek.jpg'],
    discountLabel: 'EcoDesign',
    categorySlug: 'fogoes-a-lenha',
    categoryName: 'Salamandras',
    allCategories: 'fogoes-a-lenha salamandras aquecimento'
  },
  {
    id: 'fb-p5',
    title: 'Fogão a lenha de canto com forno CH-8 R + Direct Gift',
    slug: 'fogao-a-lenha-de-canto-com-forno-ch-8-r',
    price: 1350.00,
    compareAtPrice: 1550.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794069940/lenha/woocommerce-import/rjz1i3jj6ouezjpauj7x.jpg'],
    discountLabel: '-15%',
    categorySlug: 'fogoes-a-lenha',
    categoryName: 'Salamandras',
    allCategories: 'fogoes-a-lenha salamandras aquecimento'
  },
  {
    id: 'fb-p6',
    title: 'Lareira Londres com Forno 100cm',
    slug: 'lareira-londres-com-forno-100cm',
    price: 1190.00,
    compareAtPrice: 1390.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794069321/lenha/woocommerce-import/xw2f6rymeahauygmv5lk.jpg'],
    discountLabel: 'Alta Eficiência',
    categorySlug: 'lareira-a-lenha',
    categoryName: 'Recuperadores',
    allCategories: 'lareira-a-lenha recuperadores-de-calor aquecimento'
  },
  {
    id: 'fb-p7',
    title: 'Milão Lareira com Turbina 70cm',
    slug: 'milao-lareira-com-turbina-70cm',
    price: 940.00,
    compareAtPrice: 1100.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794069415/lenha/woocommerce-import/qxcim4xcgcybajcmvyoi.jpg'],
    discountLabel: '-18%',
    categorySlug: 'lareira-a-lenha',
    categoryName: 'Recuperadores',
    allCategories: 'lareira-a-lenha recuperadores-de-calor aquecimento'
  },
  {
    id: 'fb-p8',
    title: 'Ar condicionado portátil MEI AC 4021 12.000 BTU',
    slug: 'ar-condicionado-portatil-mei-ac-4021-12000-btu',
    price: 499.00,
    compareAtPrice: 580.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794070942/lenha/woocommerce-import/ljpjrhyqwgn3khk9rar6.jpg'],
    discountLabel: 'A+++',
    categorySlug: 'climatizacao',
    categoryName: 'Climatização',
    allCategories: 'climatizacao ar-condicionado ar-condicionado-portatil'
  },
  {
    id: 'fb-p9',
    title: 'Ar Condicionado Infiniton SPLIT-3726MF Branco A++ Inverter',
    slug: 'ar-condicionado-infiniton-split-3726mf-branco-a-plus-plus',
    price: 549.00,
    compareAtPrice: 650.00,
    images: ['https://res.cloudinary.com/t7r98hdh/image/upload/v1794070891/lenha/woocommerce-import/ip28kt7renygynww33k4.jpg'],
    discountLabel: 'Inverter',
    categorySlug: 'climatizacao',
    categoryName: 'Climatização',
    allCategories: 'climatizacao ar-condicionado'
  }
];

function getCategoryEmoji(categorySlug?: string, title?: string): string {
  const s = ((categorySlug || '') + ' ' + (title || '')).toLowerCase();
  if (s.includes('pellet') || s.includes('lenha') || s.includes('sobro') || s.includes('azinho')) return '🪵';
  if (s.includes('salamandra') || s.includes('fogão') || s.includes('fogao')) return '🔥';
  if (s.includes('recuperador') || s.includes('lareira') || s.includes('forno')) return '🏠';
  if (s.includes('clima') || s.includes('ar condicionado') || s.includes('split')) return '❄️';
  if (s.includes('termo') || s.includes('agua') || s.includes('água')) return '💧';
  return '🔥';
}

function ProductCardImage({
  src,
  alt,
  categorySlug,
  title,
  categoryName
}: {
  src?: string;
  alt: string;
  categorySlug?: string;
  title: string;
  categoryName?: string;
}) {
  const [imgError, setImgError] = useState(false);

  // If no image or if loading failed, show an elegant thermal fallback card
  if (!src || imgError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200/70 p-4 text-center select-none">
        <span className="text-5xl mb-2 drop-shadow-sm">
          {getCategoryEmoji(categorySlug, title)}
        </span>
        <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase line-clamp-1">
          {categoryName || 'Silva Dias'}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      unoptimized={src.startsWith('http')}
      onError={() => setImgError(true)}
      className="object-contain p-2.5 group-hover:scale-105 transition-transform duration-500"
    />
  );
}

export default function FeaturedProductTabs({ initialProducts }: FeaturedProductTabsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const cartStore = useCartStore();

  // Combine initialProducts with verified fallbacks
  const products: ProductItem[] = React.useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) {
      return fallbackProducts;
    }
    const existingIds = new Set(initialProducts.map(p => p.id || p.slug));
    const extras = fallbackProducts.filter(f => !existingIds.has(f.id) && !existingIds.has(f.slug));
    return [...initialProducts, ...extras];
  }, [initialProducts]);

  const tabs = [
    { id: 'all', label: 'Todos' },
    { id: 'pellets', label: 'Pellets & Lenha' },
    { id: 'salamandras', label: 'Salamandras' },
    { id: 'recuperadores', label: 'Recuperadores' },
    { id: 'climatizacao', label: 'Climatização' },
  ];

  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      if (activeTab === 'all') return true;
      const haystack = (
        (p.title || '') + ' ' +
        (p.categorySlug || '') + ' ' +
        (p.categoryName || '') + ' ' +
        (p.allCategories || '')
      ).toLowerCase();

      if (activeTab === 'pellets') {
        return (
          haystack.includes('pellet') ||
          haystack.includes('lenha') ||
          haystack.includes('combust') ||
          haystack.includes('sobro') ||
          haystack.includes('azinho') ||
          haystack.includes('pinho') ||
          haystack.includes('aparas') ||
          haystack.includes('parfer')
        );
      }
      if (activeTab === 'salamandras') {
        return (
          haystack.includes('salamandra') ||
          haystack.includes('fogão') ||
          haystack.includes('fogao') ||
          haystack.includes('estufa')
        );
      }
      if (activeTab === 'recuperadores') {
        return (
          haystack.includes('recuperador') ||
          haystack.includes('lareira') ||
          haystack.includes('forno') ||
          haystack.includes('insert') ||
          haystack.includes('caldeira')
        );
      }
      if (activeTab === 'climatizacao') {
        return (
          haystack.includes('clima') ||
          haystack.includes('ar condicionado') ||
          haystack.includes('termoacumulador') ||
          haystack.includes('desumidificador') ||
          haystack.includes('radiador') ||
          haystack.includes('ventilador') ||
          haystack.includes('aquec') ||
          haystack.includes('split')
        );
      }
      return true;
    });
  }, [products, activeTab]);

  // Update slider scroll button states
  const checkScrollState = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Approximate slide index (out of 4 items per view on desktop)
    const cardWidth = clientWidth / 4;
    if (cardWidth > 0) {
      setCurrentSlideIndex(Math.round(scrollLeft / cardWidth));
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [filteredProducts]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    // Scroll by the visible viewport width (4 products on desktop, 2 on tablet, 1 on mobile)
    const scrollAmount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleAddToCart = (product: ProductItem) => {
    cartStore.addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1
    });

    setToastMessage(`✓ ${product.title} adicionado ao carrinho!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const hasSlider = filteredProducts.length > 4;

  return (
    <section id="catalogo" className="py-14 bg-stone-100/70 border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-red-600 font-extrabold text-xs uppercase tracking-wider block">
              Equipamentos & Combustíveis
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Produtos em Destaque
              </h2>
              {hasSlider && (
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-xs font-bold">
                  {filteredProducts.length} artigos
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-sm overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Carousel Navigation Arrows in Header (When > 4 products) */}
            {hasSlider && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Artigos anteriores"
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    canScrollLeft
                      ? 'bg-white border-stone-300 text-stone-800 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm'
                      : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Próximos artigos"
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    canScrollRight
                      ? 'bg-white border-stone-300 text-stone-800 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm'
                      : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel / Slider Container */}
        <div className="relative group/carousel">
          
          {/* Floating Left Arrow on Desktop */}
          {hasSlider && canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Artigos anteriores"
              className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-stone-900 shadow-xl border border-stone-200 items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Floating Right Arrow on Desktop */}
          {hasSlider && canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Próximos artigos"
              className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-stone-900 shadow-xl border border-stone-200 items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Product Cards Track: Exactly 4 products per view on desktop (lg), 2 on tablet (sm), 1 on mobile */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-3 pt-1 px-0.5"
          >
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start bg-white rounded-2xl border border-stone-200 hover:border-red-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Badges Container */}
                  <div className="relative rounded-xl bg-stone-50 border border-stone-100 aspect-square flex items-center justify-center mb-4 overflow-hidden">
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                      {prod.discountLabel ? (
                        <span className="px-2.5 py-1 bg-red-600 text-white font-extrabold text-[10px] rounded-md uppercase tracking-wider shadow-sm">
                          {prod.discountLabel}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[11px] rounded border border-emerald-200 shadow-xs">
                        Em Stock
                      </span>
                    </div>

                    {/* Resilient Product Image */}
                    <ProductCardImage
                      src={prod.images && prod.images[0] ? prod.images[0] : undefined}
                      alt={prod.title}
                      categorySlug={prod.categorySlug}
                      title={prod.title}
                      categoryName={prod.categoryName}
                    />
                  </div>

                  {/* Category & Title */}
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    {prod.categoryName || 'Soluções Térmicas'}
                  </span>
                  <Link href={`/product/${prod.slug}`}>
                    <h4 className="font-bold text-stone-900 text-sm mt-1 line-clamp-2 min-h-[40px] group-hover:text-red-600 transition-colors">
                      {prod.title}
                    </h4>
                  </Link>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 text-amber-500 text-xs mt-2">
                    <span className="tracking-tighter">★★★★★</span>
                    <span className="text-stone-400 font-normal text-[11px]">4.9 (42)</span>
                  </div>
                </div>

                {/* Price & Add to Cart Button */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                      <span className="text-stone-400 line-through text-xs block font-medium">
                        {prod.compareAtPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                      </span>
                    )}
                    <span className="text-stone-900 font-extrabold text-lg">
                      {prod.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className="px-3.5 py-2 bg-stone-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Swipe / Slide Indicator (When > 4 products) */}
          {hasSlider && (
            <div className="flex items-center justify-between sm:hidden mt-4 pt-2">
              <span className="text-xs font-semibold text-stone-500">
                {filteredProducts.length} produtos disponíveis (deslize para ver mais)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                    canScrollLeft ? 'bg-white text-stone-900 border-stone-300' : 'bg-stone-100 text-stone-300 border-stone-200'
                  }`}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                    canScrollRight ? 'bg-white text-stone-900 border-stone-300' : 'bg-stone-100 text-stone-300 border-stone-200'
                  }`}
                >
                  ›
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 text-xs font-semibold flex items-center gap-3 z-50 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
