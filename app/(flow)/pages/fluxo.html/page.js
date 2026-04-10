import { LegacyPageRenderer } from '@/components/LegacyPageRenderer';
import { getLegacyPageDocument } from '@/lib/legacyDocuments';

export const metadata = {
  title: 'Fluxo Curricular — Eng. Elétrica UFJF',
};

export default function FlowPage() {
  const document = getLegacyPageDocument('fluxo.html');
  return <LegacyPageRenderer document={document} pageKey="flow-page" />;
}
