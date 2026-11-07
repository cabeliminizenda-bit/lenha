import ThermalHero from '@/components/home/ThermalHero';
import FeaturedProductTabs from '@/components/home/FeaturedProductTabs';
import ShippingSimulator from '@/components/home/ShippingSimulator';
import HeatingGuideBlogs from '@/components/home/HeatingGuideBlogs';
import TrustBar from '@/components/home/TrustBar';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import BestDeals from '@/components/home/BestDeals';
import BestSeller from '@/components/home/BestSeller';
import LatestBlogs from '@/components/home/LatestBlogs';
import Newsletter from '@/components/home/Newsletter';
import PromoBanners from '@/components/home/PromoBanners';
import ProductGrid from '@/components/home/ProductGrid';
import FullWidthBanner from '@/components/home/FullWidthBanner';
import { SectionConfig, SectionType } from '@/app/admin/(dashboard)/landing/LandingForm';
import PreviewSectionWrapper from '@/components/admin/PreviewSectionWrapper';
import { cookies } from 'next/headers';
import { getSettings } from '@/actions/settings';

import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function PreviewPage() {
  const draftLayoutSetting = await prisma.setting.findUnique({ where: { key: 'PREVIEW_LAYOUT_DRAFT' } });
  const draftFontSetting = await prisma.setting.findUnique({ where: { key: 'PREVIEW_FONT_DRAFT' } });
  
  let layoutCookieStr = draftLayoutSetting?.value || '';
  // We can use the draft font if needed later
  
  let layout: SectionConfig[] = [];
  if (layoutCookieStr) {
    try {
      layout = JSON.parse(layoutCookieStr);
    } catch (e) {
      console.error(e);
    }
  } else {
    const settings = await getSettings();
    if (settings.HOMEPAGE_LAYOUT) {
      layout = JSON.parse(settings.HOMEPAGE_LAYOUT);
    }
  }

  const activeSections = layout.filter(s => s.enabled);

  // Fetch thermal products from Prisma
  let formattedProducts: any[] = [];
  let simulatorProducts = {
    pallets: [] as any[],
    fireplaces: [] as any[],
    climate: [] as any[]
  };

  try {
    const allDbProds = await prisma.product.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        images: true,
        discountLabel: true,
        gtin: true,
        brand: { select: { name: true } },
        categories: { select: { name: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    formattedProducts = allDbProds.slice(0, 150).map(p => ({
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

    const classify = (p: any) => {
      const t = p.title.toLowerCase();
      if (
        t.includes('salamandra') ||
        t.includes('recuperador') ||
        t.includes('lareira') ||
        t.includes('fogão') ||
        t.includes('fogao') ||
        t.includes('forno') ||
        t.includes('aquecedor') ||
        t.includes('radiador') ||
        t.includes('caldeira') ||
        t.includes('cozinha') ||
        t.includes('estufa')
      ) {
        return 'fireplaces';
      }
      if (
        t.includes('ar condicionado') ||
        t.includes('split') ||
        t.includes('climatiz') ||
        t.includes('desumidificador') ||
        t.includes('ventilador') ||
        t.includes('termoacumulador')
      ) {
        return 'climate';
      }
      if (
        t.includes('palete') ||
        t.includes('palet') ||
        t.includes('pellet') ||
        t.includes('lenha') ||
        t.includes('big bag') ||
        t.includes('aparas') ||
        t.includes('carvão') ||
        t.includes('carvao') ||
        t.includes('bioetanol') ||
        t.includes('combust')
      ) {
        return 'pallets';
      }
      return 'fireplaces';
    };

    for (const p of allDbProds) {
      const type = classify(p);
      simulatorProducts[type].push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        image: p.images?.[0] || '',
        categoryName: p.categories?.[0]?.name || '',
        brand: p.brand?.name || undefined,
        sku: p.gtin || undefined
      });
    }
  } catch (e) {
    console.error('Failed to fetch products for preview:', e);
  }

  const renderSection = (section: SectionConfig) => {
    let content = null;
    switch (section.type) {
      case 'Hero':
        content = (
          <div>
            <ThermalHero config={section.settings} isPreview={true} sectionId={section.id} />
            <TrustBar />
            <CategoryExplorer />
          </div>
        );
        break;
      case 'FeaturedProductTabs':
        content = <FeaturedProductTabs initialProducts={formattedProducts} />;
        break;
      case 'ShippingSimulator':
        content = <ShippingSimulator productsData={simulatorProducts} />;
        break;
      case 'HeatingGuideBlogs':
        content = <HeatingGuideBlogs />;
        break;
      case 'BestDeals':
        content = <BestDeals config={section.settings} />;
        break;
      case 'BestSeller':
        content = <BestSeller config={section.settings} />;
        break;
      case 'LatestBlogs':
        content = <LatestBlogs config={section.settings} />;
        break;
      case 'Newsletter':
        content = <Newsletter config={section.settings} />;
        break;
      case 'PromoBanners':
        content = <PromoBanners config={section.settings} />;
        break;
      case 'ProductGrid':
        content = <ProductGrid config={section.settings} />;
        break;
      case 'FullWidthBanner':
        content = <FullWidthBanner config={section.settings} />;
        break;
      default:
        return null;
    }

    return (
      <PreviewSectionWrapper key={section.id} sectionId={section.id} sectionName={section.name || section.type}>
        {content}
      </PreviewSectionWrapper>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {activeSections.length > 0 ? activeSections.map(renderSection) : (
          <div className="flex items-center justify-center h-64 text-gray-500">No active sections.</div>
        )}
      </main>
    </div>
  );
}
