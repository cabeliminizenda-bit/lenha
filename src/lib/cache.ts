import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

// ── Standard Minimal Projections (Anti-Egress #1) ──────────────────────────
// Strictly excludes massive HTML descriptions, full blog contents, internal attributes,
// and raw email arrays on all listing views, saving 95-99% of Supabase egress bandwidth.

export const PRODUCT_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  images: true,
  discountLabel: true,
  isBestSeller: true,
  gtin: true,
  brand: {
    select: {
      name: true
    }
  },
  categories: {
    select: {
      id: true,
      name: true,
      slug: true,
    }
  },
  reviews: {
    select: {
      rating: true,
    }
  }
} as const;

export const ARTICLE_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  image: true,
  excerpt: true,
  createdAt: true,
  authorName: true,
  category: true,
  _count: {
    select: {
      comments: {
        where: { isApproved: true }
      }
    }
  }
} as const;

// Sensitive secret keys that must NEVER be leaked to public cache or RSC props
const HIDDEN_SETTING_KEYS = new Set([
  'STRIPE_SECRET_KEY',
  'PAYPAL_SECRET',
  'CRON_SECRET',
  'SMTP_PASSWORD',
  'SMTP_PASS',
  'SMTP_USER',
  'SMTP_HOST',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SETUP_TOKEN',
  'RESEND_API_KEY',
  'CLOUDINARY_API_SECRET',
  'WOOCOMMERCE_CONSUMER_SECRET',
  'WOOCOMMERCE_CONSUMER_KEY',
]);

function isSensitiveKey(key: string): boolean {
  if (HIDDEN_SETTING_KEYS.has(key)) return true;
  const upper = key.toUpperCase();
  if (upper.startsWith('NEXT_PUBLIC_')) return false;
  return upper.includes('SECRET') || upper.includes('PASSWORD') || upper.endsWith('_PASS');
}

// Helper to get raw settings (excluding sensitive payment and service credentials)
async function fetchSettings() {
  const settingsDb = await prisma.setting.findMany();
  return settingsDb
    .filter(s => !isSensitiveKey(s.key))
    .reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
}

// ── 1. Cached Global Site Settings ──────────────────────────────────────────
export const getCachedSettings = unstable_cache(
  async () => fetchSettings(),
  ['global-settings'],
  { tags: ['settings'], revalidate: 3600 }
);

// ── 2. Cached Product Details by Slug ───────────────────────────────────────
export const getCachedProductBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      const encodedSlugLower = encodeURIComponent(slug).toLowerCase();
      const encodedSlugUpper = encodeURIComponent(slug);
      let decodedSlug = slug;
      try { decodedSlug = decodeURIComponent(slug); } catch (e) {}

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);

      let product = await prisma.product.findFirst({
        where: { 
          isDeleted: false,
          OR: [
            { slug: slug },
            { slug: encodedSlugLower },
            { slug: encodedSlugUpper },
            { slug: decodedSlug },
            ...(isUuid ? [{ id: slug }] : [])
          ]
        },
        include: {
          categories: true,
          Product_ForceSales_A: true,
          Product_SaleTogether_A: true,
          brand: true,
          tags: true,
          reviews: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } } }
          }
        }
      });

      // SEO Migration Fallback 1: If not found, check if a product exists with slug matching `${decodedSlug}-*`
      if (!product) {
        product = await prisma.product.findFirst({
          where: {
            isDeleted: false,
            slug: {
              startsWith: `${decodedSlug}-`
            }
          },
          include: {
            categories: true,
            Product_ForceSales_A: true,
            Product_SaleTogether_A: true,
            brand: true,
            tags: true,
            reviews: {
              where: { isApproved: true },
              orderBy: { createdAt: 'desc' },
              include: { user: { select: { email: true } } }
            }
          }
        });
      }

      // SEO Migration Fallback 2: If not found and input slug ends with numeric suffix (e.g. `-481`), check without suffix
      if (!product && /-\d+$/.test(decodedSlug)) {
        const strippedSlug = decodedSlug.replace(/-\d+$/, '');
        product = await prisma.product.findFirst({
          where: {
            isDeleted: false,
            slug: strippedSlug
          },
          include: {
            categories: true,
            Product_ForceSales_A: true,
            Product_SaleTogether_A: true,
            brand: true,
            tags: true,
            reviews: {
              where: { isApproved: true },
              orderBy: { createdAt: 'desc' },
              include: { user: { select: { email: true } } }
            }
          }
        });
      }

      if (!product) return null;

      // RGPD: Never leak raw emails to client RSC payload
      const sanitizedReviews = product.reviews.map(r => ({
        id: r.id,
        productId: r.productId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reviewerName: r.reviewerName || (r.user?.email ? r.user.email.split('@')[0] : 'Client'),
      }));

      return {
        ...product,
        reviews: sanitizedReviews,
      };
    },
    ['product-details', slug],
    { tags: ['products', `product-${slug}`], revalidate: 3600 }
  )();
};

// ── 3. Cached Related Products (with minimal projection) ───────────────────
export const getCachedRelatedProducts = async (categoryIds: string[], excludeProductId: string) => {
  const sortedIds = [...categoryIds].sort();
  return unstable_cache(
    async () => prisma.product.findMany({
      where: { 
        categories: { some: { id: { in: categoryIds } } }, 
        id: { not: excludeProductId },
        isDeleted: false
      },
      select: PRODUCT_CARD_SELECT,
      take: 4,
      orderBy: { createdAt: 'desc' }
    }),
    ['related-products', sortedIds.join(','), excludeProductId],
    { tags: ['products'], revalidate: 3600 }
  )();
};

// ── 4. Cached Best Sellers (with minimal projection) ────────────────────────
export const getCachedBestSellers = unstable_cache(
  async () => prisma.product.findMany({
    where: { isBestSeller: true, isDeleted: false },
    take: 8,
    select: PRODUCT_CARD_SELECT,
    orderBy: { createdAt: 'desc' }
  }),
  ['home-best-sellers'],
  { tags: ['products'], revalidate: 3600 }
);

// ── 5. Cached Latest Products (with minimal projection) ─────────────────────
export const getCachedLatestProducts = unstable_cache(
  async () => prisma.product.findMany({
    where: { isDeleted: false },
    take: 8,
    orderBy: { createdAt: 'desc' },
    select: PRODUCT_CARD_SELECT
  }),
  ['home-latest-products'],
  { tags: ['products'], revalidate: 3600 }
);

// ── 6. Cached Categories Tree for Header/Menu ──────────────────────────────
export const getCachedCategoriesTree = unstable_cache(
  async () => {
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const withProducts = allCategories.filter(c => c._count.products > 0);

    const roots = withProducts.filter(c => !c.parentId);
    const children = withProducts.filter(c => c.parentId);

    const childrenByParent = new Map<string, typeof withProducts>();
    for (const child of children) {
      if (child.parentId) {
        if (!childrenByParent.has(child.parentId)) {
          childrenByParent.set(child.parentId, []);
        }
        childrenByParent.get(child.parentId)!.push(child);
      }
    }

    const result: Array<{ id: string; name: string; slug: string | null; parentId: string | null }> = [];

    function addChildren(parentId: string) {
      const directChildren = childrenByParent.get(parentId) || [];
      for (const ch of directChildren) {
        result.push({
          id: ch.id,
          name: ch.name,
          slug: ch.slug,
          parentId: ch.parentId
        });
        addChildren(ch.id);
      }
    }

    for (const root of roots) {
      result.push({
        id: root.id,
        name: root.name,
        slug: root.slug,
        parentId: null
      });
      addChildren(root.id);
    }

    for (const ch of children) {
      if (!result.find(r => r.id === ch.id)) {
        result.push({
          id: ch.id,
          name: ch.name,
          slug: ch.slug,
          parentId: ch.parentId
        });
      }
    }

    return result;
  },
  ['header-categories-with-products'],
  { tags: ['categories', 'products'], revalidate: 3600 }
);

// ── 7. Cached Product Counts for Header Badges ─────────────────────────────
export const getCachedProductCounts = unstable_cache(
  async () => {
    const [newCount, hotCount, saleCount] = await Promise.all([
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.product.count({ where: { isDeleted: false, orderItems: { some: {} } } }),
      prisma.product.count({ where: { isDeleted: false, compareAtPrice: { not: null } } })
    ]);
    return { newCount, hotCount, saleCount };
  },
  ['layout-product-counts'],
  { tags: ['products'], revalidate: 3600 }
);

// ── 8. Cached Shop Sidebar Filter Metadata (Anti-Fluid CPU & Egress) ───────
export const getCachedShopFilters = unstable_cache(
  async () => {
    const [allCategories, allBrands, priceAgg] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
          _count: {
            select: { products: { where: { isDeleted: false } } }
          }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.brand.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { products: { where: { isDeleted: false } } }
          }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.product.aggregate({
        where: { isDeleted: false },
        _min: { price: true },
        _max: { price: true }
      })
    ]);

    return {
      allCategories,
      allBrands,
      globalMinPrice: Math.floor(priceAgg._min?.price || 0),
      globalMaxPrice: Math.ceil(priceAgg._max?.price || 1000)
    };
  },
  ['shop-filter-metadata'],
  { tags: ['filters', 'categories', 'brands', 'products'], revalidate: 3600 }
);

// ── 9. Cached Homepage Data (Hero showcase, Promos, Simulator) ──────────────
export const getCachedHomepageData = unstable_cache(
  async () => {
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
        isBestSeller: true,
        gtin: true,
        brand: { select: { name: true } },
        categories: { select: { name: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 120
    });

    const formattedProducts = allDbProds.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      images: p.images || [],
      discountLabel: p.discountLabel || (p.compareAtPrice && p.compareAtPrice > p.price ? `-${Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}%` : null),
      categorySlug: p.categories[0]?.slug || '',
      categoryName: p.categories[0]?.name || '',
      categories: p.categories.map(c => ({ name: c.name, slug: c.slug || '' })),
      allCategories: p.categories.map(c => `${c.name} ${c.slug}`).join(' ')
    }));

    const promoProducts = formattedProducts.filter(p =>
      (p.compareAtPrice && p.compareAtPrice > p.price) ||
      (p.discountLabel && p.discountLabel.trim() !== '')
    );

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

    const simulatorProducts = {
      pallets: [] as any[],
      fireplaces: [] as any[],
      climate: [] as any[]
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

    const heroShowcaseProducts = formattedProducts
      .filter(p => p.images && p.images.length > 0)
      .slice(0, 8)
      .map(p => {
        const savings = p.compareAtPrice && p.compareAtPrice > p.price ? p.compareAtPrice - p.price : 0;
        const discountPct = p.compareAtPrice && p.compareAtPrice > p.price
          ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
          : null;
        return {
          id: p.id,
          title: p.title,
          subtitle: p.categoryName ? `${p.categoryName} • Alta Eficiência EcoDesign` : 'Qualidade Garantida Silva Dias',
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          image: p.images[0],
          badge: discountPct ? `POUPANÇA -${discountPct}%` : 'TOP VENDAS',
          badgeTech: p.categoryName ? `🔥 ${p.categoryName}` : '🔥 Alto Rendimento',
          badgeTech2: savings > 0 ? `Poupe ${savings.toFixed(2).replace('.', ',')} €` : 'Stock Garantido',
          categoryName: p.categoryName || ''
        };
      });

    return {
      formattedProducts,
      promoProducts,
      simulatorProducts,
      heroShowcaseProducts
    };
  },
  ['homepage-data-v2'],
  { tags: ['products', 'homepage'], revalidate: 3600 }
);

// ── 10. Cached Active Shipping Zones & Rates ───────────────────────────────
export const getCachedShippingZones = unstable_cache(
  async () => {
    return prisma.shippingZone.findMany({
      where: { isActive: true },
      include: { methods: { where: { isActive: true }, orderBy: { rate: 'asc' } } }
    });
  },
  ['active-shipping-zones'],
  { tags: ['shipping'], revalidate: 86400 }
);

// ── 11. Cached Blog Listing ────────────────────────────────────────────────
export const getCachedBlogListing = unstable_cache(
  async () => {
    const [articles, recentArticles] = await Promise.all([
      prisma.article.findMany({
        where: { isPublished: true },
        select: ARTICLE_CARD_SELECT,
        orderBy: { createdAt: 'desc' },
        take: 24
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        select: { id: true, title: true, slug: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);
    return { articles, recentArticles };
  },
  ['blog-listing-v1'],
  { tags: ['articles'], revalidate: 3600 }
);
