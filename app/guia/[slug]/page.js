import { notFound } from 'next/navigation';
import { GuideArticle } from '@/components/GuideArticle';
import { getGuideBySlug, guides } from '@/lib/guides';

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  return guide ? { title: guide.title, description: guide.summary } : {};
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  const guideIndex = guides.findIndex((entry) => entry.slug === slug);
  const nextGuide = guides[(guideIndex + 1) % guides.length];
  return <GuideArticle guide={guide} nextGuide={nextGuide} />;
}
