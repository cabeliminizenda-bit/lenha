import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryExplorerProps {
  categories?: Array<{ id: string; name: string; slug: string | null }>;
}

const defaultCategories = [
  {
    name: 'Pellets & Lenha',
    href: '/combustiveis/lenha-e-pellets',
    image: 'https://res.cloudinary.com/t7r98hdh/image/upload/v1794069048/lenha/woocommerce-import/nhemnuopqbcehe1hoozw.jpg',
    desc: 'Sacos e Paletes',
  },
  {
    name: 'Salamandras',
    href: '/climatizacao-e-aquecimento/aquecimento',
    image: 'https://res.cloudinary.com/t7r98hdh/image/upload/v1794069203/lenha/woocommerce-import/qhwl2c5m9cgimm6d4h34.png',
    desc: 'Pellets & Lenha',
  },
  {
    name: 'Recuperadores',
    href: '/climatizacao-e-aquecimento/aquecimento/recuperadores-de-calor',
    image: 'https://res.cloudinary.com/t7r98hdh/image/upload/v1794069415/lenha/woocommerce-import/qxcim4xcgcybajcmvyoi.jpg',
    desc: 'Ventilados e Água',
  },
  {
    name: 'Fogões a Lenha',
    href: '/climatizacao-e-aquecimento/aquecimento/fogoes-a-lenha',
    image: 'https://res.cloudinary.com/t7r98hdh/image/upload/v1794069833/lenha/woocommerce-import/hmjs3dcsvzmgv9kjx5f7.jpg',
    desc: 'Com e Sem Forno',
  },
  {
    name: 'Climatização',
    href: '/climatizacao-e-aquecimento/climatizacao',
    image: 'https://res.cloudinary.com/t7r98hdh/image/upload/v1794070333/lenha/woocommerce-import/n0iwcssan0fegayxblwq.jpg',
    desc: 'Ar Condicionado A+++',
  },
  {
    name: 'Termoacumuladores',
    href: '/termoacumulador',
    image: 'https://res.cloudinary.com/t7r98hdh/image/upload/v1794069015/lenha/woocommerce-import/zsmfez6eutldwuudylk2.jpg',
    desc: 'Água Quente Sanitária',
  },
];

export default function CategoryExplorer({ categories }: CategoryExplorerProps) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-red-600 font-bold text-xs uppercase tracking-wider block">Catálogo Oficial</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Explore por Categoria</h2>
        </div>
        <Link 
          href="/shop" 
          className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors group"
        >
          <span>Ver Todas as Categorias</span>
          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {defaultCategories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="group relative bg-white rounded-2xl border border-stone-200/90 p-3 sm:p-4 hover:border-red-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Real Product Image Container */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center p-1.5 sm:p-2 mb-2 sm:mb-3 group-hover:bg-red-50/30 group-hover:border-red-200 transition-colors">
              <Image
                src={cat.image}
                alt={cat.name}
                width={96}
                height={96}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Title & Description */}
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-red-600 transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
