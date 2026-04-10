import { LegacyPageRenderer } from '@/components/LegacyPageRenderer';
import { getHomeDocument } from '@/lib/legacyDocuments';

export const metadata = {
  title: 'HELPIEEE — Guia do Calouro da Elétrica UFJF',
};

export default function HomeAliasPage() {
  const document = getHomeDocument();
  return <LegacyPageRenderer document={document} pageKey="home-index-html" />;
}
