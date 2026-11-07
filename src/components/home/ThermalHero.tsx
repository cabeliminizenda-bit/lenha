'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function ThermalHero() {
  const [added, setAdded] = useState(false);
  const cartStore = useCartStore();

  const handleAddToCart = () => {
    cartStore.addItem({
      id: 'hero-fogao-salamandra-11kw',
      productId: 'hero-fogao-salamandra-11kw',
      title: 'Fogão / Salamandra Eco 11kW a Pellets & Lenha',
      price: 1417.50,
      image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800',
      quantity: 1
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleScrollToShipping = () => {
    const el = document.getElementById('simulador-envio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white overflow-hidden py-14 lg:py-20 border-b border-stone-800">
      {/* Background Ambient Lighting & Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl" />
        {/* Subtle background stove image with dark overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-900/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-red-950/60 border border-red-600/40 rounded-full text-xs font-semibold text-red-400 backdrop-blur-md shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              <span>Campanha de Inverno 2026 • Stock Garantido em Armazém</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Promoção de Inverno!<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300">
                FOGÃO A PELLETS & LENHA
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Rendimento térmico máximo, economia comprovada e conforto para toda a família. 
              Descubra a gama completa de equipamentos certificados Eco-Design com entrega direta em sua casa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link 
                href="/shop" 
                className="px-7 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 group"
              >
                <span>Ver Ofertas em Destaque</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <button 
                onClick={handleScrollToShipping}
                className="px-6 py-3.5 bg-stone-800/90 hover:bg-stone-700/90 active:scale-95 text-stone-200 border border-stone-700 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span>Calcular Envio de Palete</span>
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800/90 text-xs text-stone-400 max-w-lg">
              <div className="space-y-0.5">
                <span className="block text-white font-bold text-sm tracking-wide">ENplus A1</span>
                <span className="text-[11px] text-stone-400">Pellets Certificados</span>
              </div>
              <div className="space-y-0.5 border-l border-stone-800 pl-4">
                <span className="block text-white font-bold text-sm tracking-wide">48 a 72h</span>
                <span className="text-[11px] text-stone-400">Entrega Rápida</span>
              </div>
              <div className="space-y-0.5 border-l border-stone-800 pl-4">
                <span className="block text-white font-bold text-sm tracking-wide">100% Seguro</span>
                <span className="text-[11px] text-stone-400">MB WAY & Multibanco</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-gradient-to-b from-stone-800/95 via-stone-850/95 to-stone-900/95 border border-stone-700/60 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              
              {/* Savings Badge */}
              <div className="absolute -top-3 -right-2 px-3.5 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-red-600/40 border border-red-500">
                POUPANÇA -25%
              </div>

              {/* Showcase Image / Visual */}
              <div className="aspect-4/3 rounded-2xl bg-stone-950/80 border border-stone-800 relative overflow-hidden group flex items-center justify-center p-4">
                <Image
                  src="https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800"
                  alt="Fogão e Salamandra a Pellets & Lenha Eco 11kW"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-900/90 rounded-md text-[11px] font-semibold text-amber-300 border border-stone-700/60">
                    <span>🔥</span> Alto Rendimento 92%
                  </span>
                  <span className="text-[11px] font-medium text-stone-300 bg-black/60 px-2 py-0.5 rounded">
                    Até 110 m²
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
                      Fogão / Salamandra Eco 11kW
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Combustão limpa • Pellets & Lenha • EcoDesign 2026
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-red-400 font-extrabold text-2xl sm:text-3xl">
                    1.417,50 €
                  </span>
                  <span className="text-stone-500 line-through text-sm">
                    1.890,00 €
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 ml-auto bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Poupe 472,50 €
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleAddToCart}
                className={`w-full mt-4 py-3.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-red-600/30'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Adicionado ao Carrinho!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Adicionar ao Carrinho</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
