import React from 'react';
import Link from 'next/link';

interface CategoryExplorerProps {
  categories?: Array<{ id: string; name: string; slug: string | null }>;
}

const defaultCategories = [
  { name: 'Pellets & Lenha', slug: 'pellets-e-lenha', icon: '🪵', desc: 'Sacos e Paletes', bg: 'bg-amber-50 group-hover:bg-amber-100' },
  { name: 'Salamandras', slug: 'salamandras', icon: '🔥', desc: 'Pellets & Lenha', bg: 'bg-red-50 group-hover:bg-red-100' },
  { name: 'Recuperadores', slug: 'recuperadores-de-calor', icon: '🏠', desc: 'Ventilados e Água', bg: 'bg-orange-50 group-hover:bg-orange-100' },
  { name: 'Fogões a Lenha', slug: 'fogoes', icon: '🍳', desc: 'Com e Sem Forno', bg: 'bg-stone-100 group-hover:bg-stone-200' },
  { name: 'Climatização', slug: 'climatizacao', icon: '❄️', desc: 'Ar Condicionado A+++', bg: 'bg-blue-50 group-hover:bg-blue-100' },
  { name: 'Termoacumuladores', slug: 'termoacumuladores', icon: '💧', desc: 'Água Quente Sanitária', bg: 'bg-cyan-50 group-hover:bg-cyan-100' },
];

export default function CategoryExplorer({ categories }: CategoryExplorerProps) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-red-600 font-bold text-xs uppercase tracking-wider block">Catálogo Completo</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Explore por Categoria</h2>
        </div>
        <Link 
          href="/shop" 
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          Ver Todas as Categorias &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {defaultCategories.map((cat, idx) => (
          <Link
            key={idx}
            href={`/product-category/${cat.slug}`}
            className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-red-300 hover:shadow-lg hover:-translate-y-1 transition-all text-center group cursor-pointer"
          >
            <div className={`w-14 h-14 mx-auto rounded-xl ${cat.bg} flex items-center justify-center text-2xl transition-colors mb-3`}>
              {cat.icon}
            </div>
            <h3 className="font-bold text-stone-900 text-sm group-hover:text-red-600 transition-colors">
              {cat.name}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
