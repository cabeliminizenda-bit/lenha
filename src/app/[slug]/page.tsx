import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPageBySlug } from '@/actions/pages';
import SafeHTML from '@/components/SafeHTML';
import { getContactSettings } from '@/actions/contactSettings';
import ContactPageContent from '@/components/contact/ContactPageContent';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const contactSettings = await getContactSettings();
  if (resolvedParams.slug === contactSettings.slug) {
    return { title: contactSettings.title };
  }

  const { data: page } = await getPageBySlug(resolvedParams.slug);
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Lenha & Carvão Silva Dias";
  
  if (!page || !page.isPublished) {
    return {
      title: `Page not found - ${storeName}`,
    };
  }

  return {
    title: page.metaTitle ? page.metaTitle : `${page.title} - ${storeName}`,
    description: page.metaDescription || undefined,
    keywords: page.metaKeywords || undefined,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/${page.slug}`,
      siteName: storeName,
      type: 'website',
    }
  };
}

const LEGAL_NAV = [
  { slug: 'devolucoes', label: 'Devoluções & Reembolso', icon: '🔄' },
  { slug: 'termos-e-condicoes', label: 'Termos & Condições', icon: '📜' },
  { slug: 'privacidade', label: 'Privacidade & RGPD', icon: '🔒' },
  { slug: 'expedicao', label: 'Expedição & Entrega', icon: '🚚' },
  { slug: 'politica-de-garantia', label: 'Garantia', icon: '🛡️' },
  { slug: 'politica-de-faturacao', label: 'Faturação & NIF', icon: '🧾' },
];

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  const contactSettings = await getContactSettings();
  if (resolvedParams.slug === contactSettings.slug) {
    return <ContactPageContent />;
  }

  const { data: page, success } = await getPageBySlug(resolvedParams.slug);

  if (!success || !page || !page.isPublished) {
    notFound();
  }

  const currentSlug = resolvedParams.slug;
  const isLegalSlug = LEGAL_NAV.some(item => 
    item.slug === currentSlug || 
    (currentSlug.startsWith('politica-de-') && item.slug.includes(currentSlug.replace('politica-de-', '')))
  ) || ['condicoes-gerais-de-venda', 'notas-legais'].includes(currentSlug);

  return (
    <div className="min-h-screen bg-stone-50/60 flex flex-col py-8 sm:py-12">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-red-600 transition-colors">Início</Link>
          <span>/</span>
          {isLegalSlug && (
            <>
              <span className="text-stone-600">Políticas Legais</span>
              <span>/</span>
            </>
          )}
          <span className="text-stone-900 font-bold">{page.title}</span>
        </nav>

        {/* Hero Header Card */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider mb-4">
              <span>{isLegalSlug ? '⚖️' : '📄'}</span>
              <span>{isLegalSlug ? 'Termos Oficiais & Transparência Silva Dias' : 'Informações Oficiais'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              {page.title}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Lenha & Carvão Silva Dias • Braga, Portugal • Encomendas seguras com rastreamento e entrega direta.
            </p>
          </div>
        </div>

        {/* Legal Quick Nav Bar */}
        {isLegalSlug && (
          <div className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {LEGAL_NAV.map((item) => {
                const isActive = currentSlug === item.slug || 
                  (currentSlug === 'politica-de-devolucao-e-reembolso' && item.slug === 'devolucoes') ||
                  (currentSlug === 'condicoes-gerais-de-venda' && item.slug === 'termos-e-condicoes') ||
                  (currentSlug === 'politica-de-privacidade' && item.slug === 'privacidade') ||
                  (currentSlug === 'politica-de-expedicao' && item.slug === 'expedicao') ||
                  (currentSlug === 'politica-de-garantia-2' && item.slug === 'politica-de-garantia');

                return (
                  <Link
                    key={item.slug}
                    href={`/${item.slug}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                      isActive
                        ? 'bg-red-600 text-white shadow-red-600/30 ring-2 ring-red-400/50'
                        : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 mb-10">
          {/* Desktop Content */}
          <SafeHTML 
            html={page.desktopContent || ''}
            className="hidden md:block w-full prose max-w-none text-stone-700 prose-headings:text-stone-900 prose-headings:font-bold prose-strong:text-stone-900 prose-a:text-red-600 hover:prose-a:underline"
          />
          
          {/* Mobile Content */}
          <SafeHTML 
            html={page.mobileContent || (page.desktopContent || '')}
            className="block md:hidden w-full prose max-w-none text-stone-700 prose-headings:text-stone-900 prose-headings:font-bold prose-strong:text-stone-900 prose-a:text-red-600 hover:prose-a:underline"
          />
        </div>

        {/* Support & Legal Assistance Card */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-850 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Apoio ao Cliente & Faturação
            </span>
            <h3 className="text-xl font-bold text-white">
              Dúvidas sobre Devoluções, Garantias ou Faturas?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
              A nossa equipa em Braga está disponível para prestar esclarecimentos imediatos sobre qualquer procedimento ou encomenda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="mailto:cabeliminizenda@gmail.com"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm text-center shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>✉️</span>
              <span>Enviar E-mail</span>
            </a>
            <Link
              href="/contactos"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs sm:text-sm text-center border border-stone-700 transition flex items-center justify-center gap-2"
            >
              <span>📞</span>
              <span>Página de Contactos</span>
            </Link>
          </div>
        </div>

        {/* Livro de Reclamações Online Banner */}
        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <div>
            <span>© {new Date().getFullYear()} Lenha & Carvão Silva Dias. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.livroreclamacoes.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-red-600 font-semibold transition-colors"
            >
              <span>Livro de Reclamações Online</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
