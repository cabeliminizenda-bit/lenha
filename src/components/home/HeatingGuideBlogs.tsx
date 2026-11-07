import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';

export default async function HeatingGuideBlogs() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    });
  } catch (e) {
    console.error('Error fetching articles for HeatingGuideBlogs', e);
  }

  const fallbackArticles = [
    {
      id: 'a1',
      title: 'Como escolher entre uma Salamandra a Pellets ou a Lenha?',
      slug: 'como-escolher-salamandra-pellets-ou-lenha',
      category: 'Guia de Compra',
      excerpt: 'Descubra as diferenças de rendimento térmico, custo do combustível e autonomia diária para fazer a melhor escolha para a sua habitação.',
      image: null,
      icon: '🪵'
    },
    {
      id: 'a2',
      title: 'Dicas para aumentar a durabilidade do seu Recuperador de Calor',
      slug: 'dicas-aumentar-durabilidade-recuperador-calor',
      category: 'Manutenção',
      excerpt: 'A limpeza correta dos tubos de exaustão e da câmara de combustão evita perdas de calor e garante máxima segurança no inverno.',
      image: null,
      icon: '🔥'
    },
    {
      id: 'a3',
      title: 'Por que os Pellets Certificados ENplus A1 geram mais economia?',
      slug: 'vantagens-pellets-certificados-enplus-a1',
      category: 'Poupança Energética',
      excerpt: 'Menor humidade e baixa percentagem de cinzas reduzem o consumo de sacos em mais de 20% ao longo do inverno.',
      image: null,
      icon: '💰'
    }
  ];

  const items = articles.length > 0 ? articles : fallbackArticles;

  const getArticleIcon = (slug?: string, title?: string, fallbackIcon?: string) => {
    if (fallbackIcon) return fallbackIcon;
    const s = ((slug || '') + ' ' + (title || '')).toLowerCase();
    if (s.includes('pellet') || s.includes('lenha') || s.includes('escolher')) return '🪵';
    if (s.includes('recuperador') || s.includes('durabilidade')) return '🔥';
    if (s.includes('economia') || s.includes('poupanca') || s.includes('certificado')) return '💰';
    return '🪵';
  };

  return (
    <section id="blog-dicas" className="py-14 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-red-600 font-bold text-xs uppercase tracking-wider block">
              Dicas & Artigos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Guia de Aquecimento Eficiente
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            Ver Todos os Artigos &rarr;
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((art: any) => (
            <article 
              key={art.id} 
              className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-5xl overflow-hidden relative">
                  {art.image ? (
                    <Image 
                      src={art.image} 
                      alt={art.title} 
                      width={600} 
                      height={400} 
                      unoptimized={art.image.startsWith('http')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <span className="select-none">{getArticleIcon(art.slug, art.title, art.icon)}</span>
                  )}
                </div>
                
                <div className="p-5">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                    {art.category || 'Dicas de Aquecimento'}
                  </span>
                  <Link href={`/blog/${art.slug}`}>
                    <h3 className="font-bold text-stone-900 text-base mt-1 group-hover:text-red-600 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <Link 
                  href={`/blog/${art.slug}`} 
                  className="inline-flex items-center text-xs font-bold text-stone-900 hover:text-red-600 transition-colors gap-1"
                >
                  Ler Artigo Completo &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
