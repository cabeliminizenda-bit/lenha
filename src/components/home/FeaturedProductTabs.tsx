'use client';

import React, { useState } from 'react';
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
}

interface FeaturedProductTabsProps {
  initialProducts?: ProductItem[];
}

const fallbackProducts: ProductItem[] = [
  {
    id: 'p1',
    title: 'Palete de Pellets ENplus A1 (70 Sacos de 15kg - 1050kg)',
    slug: 'palete-pellets-enplus-a1-70-sacos',
    price: 369.90,
    compareAtPrice: 420.00,
    images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'],
    discountLabel: 'Promoção',
    categorySlug: 'pellets-e-lenha',
    categoryName: 'Pellets & Lenha'
  },
  {
    id: 'p2',
    title: 'Salamandra a Pellets 9kW Ventilada com Comando Wi-Fi',
    slug: 'salamandra-pellets-9kw-ventilada-wifi',
    price: 1090.00,
    compareAtPrice: 1350.00,
    images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800'],
    discountLabel: 'Top Vendas',
    categorySlug: 'salamandras',
    categoryName: 'Salamandras'
  },
  {
    id: 'p3',
    title: 'Recuperador de Calor a Lenha 14kW com Ventilação Forçada',
    slug: 'recuperador-calor-lenha-14kw-ventilado',
    price: 975.00,
    compareAtPrice: 1190.00,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'],
    discountLabel: '-18%',
    categorySlug: 'recuperadores-de-calor',
    categoryName: 'Recuperadores'
  },
  {
    id: 'p4',
    title: 'Ar Condicionado Split Inverter 12.000 BTU R32 com Wi-Fi A+++',
    slug: 'ar-condicionado-split-inverter-12000-btu-r32',
    price: 529.00,
    compareAtPrice: 649.00,
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800'],
    discountLabel: 'A+++',
    categorySlug: 'climatizacao',
    categoryName: 'Climatização'
  },
  {
    id: 'p5',
    title: 'Lenha de Carvalho Seca em Palete (1.5 Estéreos pronta a queimar)',
    slug: 'lenha-carvalho-seca-palete',
    price: 245.00,
    compareAtPrice: 280.00,
    images: ['https://images.unsplash.com/photo-1520114878144-6123749968dd?w=800'],
    discountLabel: 'Stock Limitado',
    categorySlug: 'pellets-e-lenha',
    categoryName: 'Pellets & Lenha'
  },
  {
    id: 'p6',
    title: 'Salamandra a Lenha em Ferro Fundido 11kW Modelo Vintage',
    slug: 'salamandra-lenha-ferro-fundido-11kw',
    price: 849.00,
    compareAtPrice: 990.00,
    images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800'],
    discountLabel: 'EcoDesign 2026',
    categorySlug: 'salamandras',
    categoryName: 'Salamandras'
  },
  {
    id: 'p7',
    title: 'Recuperador de Calor a Pellets Canalizável 12kW com Dupla Saída',
    slug: 'recuperador-calor-pellets-canalizavel-12kw',
    price: 1450.00,
    compareAtPrice: 1690.00,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'],
    discountLabel: 'Alta Eficiência',
    categorySlug: 'recuperadores-de-calor',
    categoryName: 'Recuperadores'
  },
  {
    id: 'p8',
    title: 'Termoacumulador Elétrico Inteligente 100L EcoPlus A+',
    slug: 'termoacumulador-eletrico-inteligente-100l',
    price: 289.00,
    compareAtPrice: 349.00,
    images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800'],
    discountLabel: 'Poupança',
    categorySlug: 'climatizacao',
    categoryName: 'Climatização'
  }
];

function getCategoryEmoji(categorySlug?: string, title?: string): string {
  const s = ((categorySlug || '') + ' ' + (title || '')).toLowerCase();
  if (s.includes('pellet') || s.includes('lenha')) return '🪵';
  if (s.includes('salamandra')) return '🔥';
  if (s.includes('recuperador')) return '🏠';
  if (s.includes('clima') || s.includes('ar condicionado')) return '❄️';
  if (s.includes('termo') || s.includes('agua')) return '💧';
  return '🔥';
}

export default function FeaturedProductTabs({ initialProducts }: FeaturedProductTabsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const cartStore = useCartStore();

  // Merge initialProducts with fallbackProducts to guarantee rich options for each tab
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

  const filteredProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    const catSlug = (p.categorySlug || '').toLowerCase();
    const catName = (p.categoryName || '').toLowerCase();
    const title = (p.title || '').toLowerCase();

    if (activeTab === 'pellets') {
      return catSlug.includes('pellet') || catSlug.includes('lenha') || catName.includes('pellet') || catName.includes('lenha') || title.includes('pellet') || title.includes('lenha');
    }
    if (activeTab === 'salamandras') {
      return catSlug.includes('salamandra') || catName.includes('salamandra') || title.includes('salamandra');
    }
    if (activeTab === 'recuperadores') {
      return catSlug.includes('recuperador') || catName.includes('recuperador') || title.includes('recuperador');
    }
    if (activeTab === 'climatizacao') {
      return catSlug.includes('clima') || catSlug.includes('termo') || catName.includes('clima') || catName.includes('termo') || title.includes('ar condicionado') || title.includes('termoacumulador');
    }
    return true;
  });

  const handleAddToCart = (product: ProductItem) => {
    cartStore.addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1
    });

    setToastMessage(`${product.title} adicionado ao carrinho!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <section id="catalogo" className="py-14 bg-stone-100/70 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-red-600 font-bold text-xs uppercase tracking-wider block">
              Equipamentos & Combustíveis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Produtos em Destaque
            </h2>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-sm overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all p-4 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative rounded-xl bg-stone-50 border border-stone-100 aspect-square flex items-center justify-center p-4 mb-4 overflow-hidden">
                  {prod.discountLabel && (
                    <span className="absolute top-2 left-2 z-10 px-2.5 py-1 bg-red-600 text-white font-extrabold text-[10px] rounded-md uppercase tracking-wider shadow">
                      {prod.discountLabel}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[11px] rounded border border-emerald-200">
                    Em Stock
                  </span>

                  {prod.images && prod.images[0] ? (
                    <Image
                      src={prod.images[0]}
                      alt={prod.title}
                      width={400}
                      height={400}
                      unoptimized={prod.images[0].startsWith('http')}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-6xl select-none">{getCategoryEmoji(prod.categorySlug, prod.title)}</span>
                  )}
                </div>

                {/* Category & Title */}
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  {prod.categoryName || 'Soluções Térmicas'}
                </span>
                <Link href={`/product/${prod.slug}`}>
                  <h4 className="font-bold text-stone-900 text-sm mt-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {prod.title}
                  </h4>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-amber-500 text-xs mt-2">
                  <span>★★★★★</span>
                  <span className="text-stone-400 font-normal text-[11px]">4.9 (42)</span>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                    <span className="text-stone-400 line-through text-xs block">
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
                  className="px-3.5 py-2 bg-stone-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 text-xs font-semibold flex items-center gap-3 z-50 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
