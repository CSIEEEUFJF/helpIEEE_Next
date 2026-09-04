import Link from 'next/link';
import FlowCurriculumExplorer from '@/components/FlowCurriculumExplorer';

export const metadata = {
  title: 'Fluxo curricular',
  description: 'Explore períodos, pré-requisitos e progresso nas 15 ofertas presenciais do ICE e em grades de Engenharias da UFJF.',
};

export default function FlowPage() {
  return (
    <div className="flow-page">
      <div className="flow-page__intro">
        <div className="container breadcrumb breadcrumb--dark">
          <Link href="/">Início</Link><span aria-hidden="true">/</span><span>Fluxo curricular</span>
        </div>
      </div>
      <div className="container flow-app">
        <FlowCurriculumExplorer />
      </div>
    </div>
  );
}
