import Link from 'next/link';
import FlowCurriculumExplorer from '@/components/FlowCurriculumExplorer';

export const metadata = {
  title: 'Fluxo e eletivas',
  description: 'Explore grades, pré-requisitos, progresso e catálogos de eletivas dos cursos presenciais do ICE e da Faculdade de Engenharia da UFJF.',
};

export default function FlowPage() {
  return (
    <div className="flow-page">
      <div className="flow-page__intro">
        <div className="container breadcrumb breadcrumb--dark">
          <Link href="/">Início</Link><span aria-hidden="true">/</span><span>Fluxo e eletivas</span>
        </div>
      </div>
      <div className="container flow-app">
        <FlowCurriculumExplorer />
      </div>
    </div>
  );
}
