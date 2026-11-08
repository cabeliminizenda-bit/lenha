'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  title: string;
  discountLabel?: string | null;
  compareAtPrice?: number | null;
  price?: number;
  activeVariationImage?: string | null;
};

export default function ProductGallery({ 
  images, 
  title, 
  discountLabel, 
  compareAtPrice, 
  price, 
  activeVariationImage 
}: ProductGalleryProps) {
  const hasImages = images && images.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);

  // When a variation image is passed, focus on index 0
  useEffect(() => {
    if (activeVariationImage) {
      setSelectedIndex(0);
    }
  }, [activeVariationImage]);

  const mainImage = activeVariationImage || (hasImages ? images[selectedIndex] : null);

  return (
    <div className="w-full lg:w-1/2 flex flex-col-reverse lg:flex-row gap-3 sm:gap-4 lg:self-start lg:sticky lg:top-8">
      
      {/* Thumbnails Row on Mobile / Column on Desktop */}
      <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 lg:py-0 lg:w-20 shrink-0">
        {/* Desktop Up Arrow */}
        <button 
          type="button"
          onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
          disabled={!hasImages || selectedIndex === 0}
          aria-label="Foto anterior"
          className="hidden lg:flex w-full py-1 border border-stone-300 rounded text-stone-700 hover:bg-red-50 hover:text-red-600 hover:border-red-500 justify-center disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        
        {hasImages ? (
          images.slice(0, 8).map((img, idx) => (
            <button 
              type="button"
              key={idx} 
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Ver foto ${idx + 1}`}
              className={`border-2 rounded-xl overflow-hidden cursor-pointer h-16 w-16 sm:h-20 sm:w-20 shrink-0 transition-all bg-stone-50 p-1 ${
                idx === selectedIndex 
                  ? 'border-red-600 ring-2 ring-red-500/30 scale-102' 
                  : 'border-stone-200 hover:border-stone-400 opacity-75 hover:opacity-100'
              }`}
            >
              <Image 
                width={120} 
                height={120} 
                src={img} 
                alt={`${title} - Miniatura ${idx + 1}`} 
                title={`${title} - Miniatura ${idx + 1}`} 
                className="w-full h-full object-contain" 
              />
            </button>
          ))
        ) : (
          <div className="border-2 border-stone-200 rounded-xl h-16 w-16 sm:h-20 sm:w-20 bg-stone-100 flex items-center justify-center text-xl shrink-0">
            🔥
          </div>
        )}
        
        {/* Desktop Down Arrow */}
        <button 
          type="button"
          onClick={() => setSelectedIndex(Math.min((images?.length || 1) - 1, selectedIndex + 1))}
          disabled={!hasImages || selectedIndex >= Math.min(7, images.length - 1)}
          aria-label="Próxima foto"
          className="hidden lg:flex w-full py-1 border border-stone-300 rounded text-stone-700 hover:bg-red-50 hover:text-red-600 hover:border-red-500 justify-center mt-auto disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Large Image Container */}
      <div className="flex-1 border border-stone-200/90 rounded-2xl relative overflow-hidden flex items-center justify-center bg-white aspect-square sm:min-h-[420px] shadow-sm">
        {discountLabel && compareAtPrice && price && compareAtPrice > price && (
          <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 bg-red-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md z-10 shadow-sm">
            {discountLabel}
          </span>
        )}

        {/* Total images pill for mobile */}
        {hasImages && images.length > 1 && (
          <span className="lg:hidden absolute bottom-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </span>
        )}

        {mainImage ? (
          <Image 
            width={900} 
            height={900} 
            src={mainImage} 
            alt={title} 
            title={title} 
            priority
            className="w-full h-full object-contain p-4 sm:p-6 transition-all duration-300" 
          />
        ) : (
          <div className="text-7xl text-stone-300">🔥</div>
        )}
      </div>

    </div>
  );
}
