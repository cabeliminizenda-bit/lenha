import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getCachedSettings } from '@/lib/cache';

export const revalidate = 86400;

const DEFAULT_DISALLOW_PATHS = [
  '/admin/',
  '/account/',
  '/checkout/',
  '/api/',
  '/preview',
  '/search',
  '/search/*',
  '/categorie-produit/',
  '/produit/',
  '/*?*sort=',
  '/*?*page=',
  '/*?*filter=',
  '/*?*filter_cat=',
  '/*?*q=',
  '/*?*category=',
  '/*?*brand=',
  '/*?*min_price=',
  '/*?*max_price=',
  '/*?*rating_filter=',
  '/*?*stock_status=',
  '/*?*featured=',
  '/*?*best_seller=',
  '/*?*add-to-cart=',
  '/*?*column=',
  '/*?*per_page='
];

const BLOCKED_BOTS = [
  'SemrushBot',
  'AhrefsBot',
  'DotBot',
  'PetalBot',
  'MJ12bot',
  'Bytespider',
  'DataForSeoBot'
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = SITE_URL;
  const settingsMap = await getCachedSettings();

  let disallowPaths: string[] = DEFAULT_DISALLOW_PATHS;
  if (settingsMap['ROBOTS_DISALLOW_PATHS']) {
    try {
      disallowPaths = JSON.parse(settingsMap['ROBOTS_DISALLOW_PATHS']);
    } catch {
      disallowPaths = DEFAULT_DISALLOW_PATHS;
    }
  }

  const crawlDelay = settingsMap['ROBOTS_CRAWL_DELAY']
    ? parseInt(settingsMap['ROBOTS_CRAWL_DELAY'], 10)
    : undefined;

  return {
    rules: [
      {
        userAgent: BLOCKED_BOTS,
        disallow: ['/']
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
        ...(crawlDelay && !isNaN(crawlDelay) ? { crawlDelay } : {})
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
