import { notFound, redirect } from 'next/navigation';
import { legacySlugMap } from '@/lib/guides';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legacySlugMap)
    .filter((slug) => slug !== 'index.html' && slug !== 'fluxo.html')
    .map((slug) => ({ slug }));
}

export default async function LegacyContentRedirect({ params }) {
  const { slug } = await params;
  const destination = legacySlugMap[slug];
  if (!destination) notFound();
  redirect(destination);
}
