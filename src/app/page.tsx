import ThermalHero from '@/components/home/ThermalHero';
import Newsletter from '@/components/home/Newsletter';
import PromoBanners from '@/components/home/PromoBanners';
import FullWidthBanner from '@/components/home/FullWidthBanner';
import TrustBar from '@/components/home/TrustBar';
import CategoryExplorer from '@/components/home/CategoryExplorer';
import ShippingSimulator from '@/components/home/ShippingSimulator';
import FeaturedProductTabs from '@/components/home/FeaturedProductTabs';
import HeatingGuideBlogs from '@/components/home/HeatingGuideBlogs';
import { SectionConfig } from '@/app/admin/(dashboard)/landing/LandingForm';
import { getCachedSettings, getCachedHomepageData } from '@/lib/cache';

export const revalidate = 300;

export default async function Home() {
  const [settings, homepageData] = await Promise.all([
    getCachedSettings(),
    getCachedHomepageData()
  ]);

  const { promoProducts, simulatorProducts, heroShowcaseProducts } = homepageData;

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
            <ThermalHero config={section.settings} showcaseProducts={heroShowcaseProducts} />
            <TrustBar />
            <CategoryExplorer />
          </div>
        );
      case 'FeaturedProductTabs':
      case 'BestDeals':
      case 'ProductGrid':
        return <FeaturedProductTabs key={section.id} initialProducts={promoProducts} />;
      case 'ShippingSimulator':
      case 'BestSeller':
        return <ShippingSimulator key={section.id} productsData={simulatorProducts} />;
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
