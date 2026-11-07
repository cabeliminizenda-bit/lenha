import ThermalHero from '@/components/home/ThermalHero';
import Newsletter from '@/components/home/Newsletter';
import PromoBanners from '@/components/home/PromoBanners';
import FullWidthBanner from '@/components/home/FullWidthBanner';
import TrustBar from '@/components/home/TrustBar';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import ShippingSimulator from '@/components/home/ShippingSimulator';
import FeaturedProductTabs from '@/components/home/FeaturedProductTabs';
import HeatingGuideBlogs from '@/components/home/HeatingGuideBlogs';
import prisma from '@/lib/prisma';
import { SectionConfig } from '@/app/admin/(dashboard)/landing/LandingForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await import('@/lib/cache').then(m => m.getCachedSettings());

  // Fetch thermal products from Prisma
  let formattedProducts: any[] = [];
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isDeleted: false },
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
      take: 150
    });

    formattedProducts = dbProducts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      images: p.images || [],
      discountLabel: p.discountLabel || (p.compareAtPrice && p.compareAtPrice > p.price ? `-${Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}%` : null),
      categorySlug: p.categories[0]?.slug || '',
      categoryName: p.categories[0]?.name || '',
      allCategories: p.categories.map(c => `${c.name} ${c.slug}`).join(' ')
    }));
  } catch (e) {
    console.error('Failed to fetch products for homepage:', e);
  }

  let layout: SectionConfig[] = [];
  try {
    if (settings.HOMEPAGE_LAYOUT) {
      layout = JSON.parse(settings.HOMEPAGE_LAYOUT);
    } else {
      layout = [
        { id: 'sec_1', type: 'Hero', name: 'Hero', enabled: true, settings: {} },
        { id: 'sec_featured', type: 'FeaturedProductTabs', name: 'Produtos em Destaque', enabled: true, settings: {} },
        { id: 'sec_shipping', type: 'ShippingSimulator', name: 'Simulador de Envio', enabled: true, settings: {} },
        { id: 'sec_blogs', type: 'HeatingGuideBlogs', name: 'Guia de Aquecimento', enabled: true, settings: {} },
        { id: 'sec_newsletter', type: 'Newsletter', name: 'Newsletter', enabled: true, settings: {} }
      ];
    }
  } catch (e) {
    console.error('Failed to parse HOMEPAGE_LAYOUT', e);
  }

  // Filter only enabled sections
  const activeSections = layout.filter(s => s.enabled);

  const renderSection = (section: SectionConfig) => {
    switch (section.type) {
      case 'Hero':
        return (
          <div key={section.id}>
            <ThermalHero config={section.settings} />
            <TrustBar />
            <CategoryExplorer />
          </div>
        );
      case 'FeaturedProductTabs':
      case 'BestDeals':
      case 'ProductGrid':
        return <FeaturedProductTabs key={section.id} initialProducts={formattedProducts} />;
      case 'ShippingSimulator':
      case 'BestSeller':
        return <ShippingSimulator key={section.id} />;
      case 'HeatingGuideBlogs':
      case 'LatestBlogs':
        return <HeatingGuideBlogs key={section.id} />;
      case 'Newsletter':
        return <Newsletter key={section.id} config={section.settings} />;
      case 'PromoBanners':
        return <PromoBanners key={section.id} config={section.settings} />;
      case 'FullWidthBanner':
        return <FullWidthBanner key={section.id} config={section.settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {activeSections.map(renderSection)}
      </main>
    </div>
  );
}
