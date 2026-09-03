import Link from 'next/link';
import CurriculumExplorer from '@/components/CurriculumExplorer';

export const metadata = {
  title: 'Fluxo curricular',
  description: 'Explore períodos, pré-requisitos e progresso em grades de Exatas e Engenharias da UFJF.',
};

export default async function FlowPage({ searchParams }) {
  const params = await searchParams;
  const initialCourse = typeof params?.curso === 'string' ? params.curso : undefined;

  return (
    <div className="flow-page">
      <div className="flow-page__intro">
        <div className="container breadcrumb breadcrumb--dark">
          <Link href="/">Início</Link><span aria-hidden="true">/</span><span>Fluxo curricular</span>
        </div>
      </div>
      <div className="container flow-app">
        <CurriculumExplorer initialCourse={initialCourse} />
        <div className="flow-disclaimer">
          <strong>Use como apoio ao planejamento.</strong> Grades e pré-requisitos podem mudar. Confirme decisões de matrícula no SIGA e com a coordenação do seu curso.
        </div>
      </div>
    </div>
  );
}
