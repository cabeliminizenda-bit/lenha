import { notFound, permanentRedirect } from 'next/navigation';
import ShopPage from '@/app/shop/page';
import prisma from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';
import { getCategoryByPathSegments, getCategoryCanonicalPath } from '@/lib/categories';
import { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Lenha & Carvão Silva Dias";

  if (!slug || slug.length === 0) {
    return { title: `Categoria não encontrada - ${storeName}` };
  }

  const category = await getCategoryByPathSegments(slug);
  if (!category) {
    return { title: `Categoria não encontrada - ${storeName}` };
  }

  const canonicalPath = await getCategoryCanonicalPath(category);

  return {
    title: category.metaTitle ? category.metaTitle : `${category.name} | ${storeName}`,
    description: category.metaDescription || `Compre produtos de ${category.name} com os melhores preços e entrega rápida na Lenha & Carvão Silva Dias.`,
    keywords: category.metaKeywords || undefined,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
    },
    openGraph: {
      title: category.metaTitle || `${category.name} | ${storeName}`,
      description: category.metaDescription || `Compre produtos de ${category.name} na Lenha & Carvão Silva Dias.`,
      url: `${SITE_URL}${canonicalPath}`,
      siteName: storeName,
      type: 'website',
    }
  };
}

export default async function CategoriaDeProdutoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    notFound();
  }

  const category = await getCategoryByPathSegments(slug);
  if (!category) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category !== undefined
    ? resolvedSearchParams.category
    : (category.slug || category.id);

  const newSearchParams = Promise.resolve({
    ...resolvedSearchParams,
    category: activeCategory
  });

  return <ShopPage searchParams={newSearchParams} />;
}
