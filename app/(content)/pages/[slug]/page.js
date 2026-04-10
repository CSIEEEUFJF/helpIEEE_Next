import { notFound } from 'next/navigation';
import { LegacyPageRenderer } from '@/components/LegacyPageRenderer';
import { getLegacyPageDocument, listLegacyPageSlugs } from '@/lib/legacyDocuments';

export const dynamicParams = false;

export function generateStaticParams() {
  return listLegacyPageSlugs()
    .filter((slug) => slug !== 'fluxo.html')
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const document = getLegacyPageDocument(slug);

  if (!document) {
    return {};
  }

  return {
    title: document.title,
  };
}

export default async function LegacyContentPage({ params }) {
  const { slug } = await params;

  if (slug === 'fluxo.html') {
    notFound();
  }

  const document = getLegacyPageDocument(slug);

  if (!document) {
    notFound();
  }

  return <LegacyPageRenderer document={document} pageKey={`content-${slug}`} />;
}
