import Link from 'next/link';
import { GuideCard } from '@/components/GuideCard';
import { guides } from '@/lib/guides';

export const metadata = {
  title: 'Guia do calouro',
  description: 'Trilhas práticas para começar bem nos cursos de Exatas e Engenharias da UFJF.',
};

export default function GuideIndexPage() {
  return (
    <>
      <header className="page-hero" data-header-splash>
        <div className="container">
          <nav className="breadcrumb" aria-label="Navegação estrutural"><Link href="/">Início</Link><span aria-hidden="true">/</span><span>Guia</span></nav>
          <span className="eyebrow">Conhecimento para ganhar autonomia</span>
          <h1>Seu começo, organizado em trilhas.</h1>
          <p>Informações práticas para resolver a chegada, entender a vida acadêmica, estudar melhor e encontrar pessoas e oportunidades.</p>
        </div>
      </header>
      <section className="section">
        <div className="container guide-index">
          {guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        </div>
      </section>
    </>
  );
}
