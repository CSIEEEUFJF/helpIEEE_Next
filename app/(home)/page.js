import Link from 'next/link';
import Image from 'next/image';
import { GuideCard } from '@/components/GuideCard';
import { HomeSearch } from '@/components/HomeSearch';
import { guides } from '@/lib/guides';

const exactCourses = [
  'Ciências Exatas',
  'Ciência da Computação',
  'Estatística',
  'Física',
  'Matemática',
  'Química',
  'Sistemas de Informação',
];

const engineeringCourses = [
  'Engenharia Ambiental e Sanitária',
  'Engenharia Civil',
  'Engenharia Computacional',
  'Engenharia de Produção',
  'Engenharia Elétrica',
  'Engenharia Mecânica',
];

function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function buildSearchEntries() {
  return guides.flatMap((guide) => {
    const guideEntry = {
      eyebrow: guide.eyebrow,
      title: guide.title,
      summary: guide.summary,
      searchText: normalizeSearchText(
        `${guide.title} ${guide.summary} ${guide.audience ?? ''} ${guide.scope ?? ''}`,
      ),
      href: `/guia/${guide.slug}`,
    };

    const sectionEntries = (guide.sections ?? []).map((section) => {
      const keywords = (section.items ?? [])
        .flatMap((item) => [item.title, item.text, ...(item.list ?? [])])
        .filter(Boolean)
        .join(' ');
      const summary = section.summary ?? guide.summary;

      return {
        eyebrow: guide.title,
        title: section.title,
        summary,
        searchText: normalizeSearchText(
          `${section.title} ${summary} ${keywords}`,
        ),
        href: `/guia/${guide.slug}#${section.id}`,
      };
    });

    return [guideEntry, ...sectionEntries];
  });
}

export default function HomePage() {
  const searchEntries = buildSearchEntries();

  return (
    <>
      <section className="hero-section" data-header-splash>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span>
                Um projeto desenvolvido pela IEEE Computer Society e IEEE
                Education Society do Ramo Estudantil IEEE UFJF
              </span>
            </div>
            <h1>
              Comece a UFJF com <span>direção.</span>
            </h1>
            <p className="hero-lead">
              O guia de acolhimento para quem está chegando aos cursos de Exatas e Engenharias. Informação prática, fontes oficiais e caminhos para você não precisar descobrir tudo sozinho.
            </p>
            <div className="button-row">
              <Link className="button button--primary" href="/guia/chegada">
                Quero começar agora <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button--ghost" href="/fluxo">
                Ver fluxo curricular
              </Link>
            </div>
            <HomeSearch entries={searchEntries} />
          </div>

          <aside className="start-card" aria-label="Rota recomendada para começar">
            <div className="start-card__head">
              <span className="eyebrow">Sua primeira semana</span>
              <span className="status-dot">Guia rápido</span>
            </div>
            <h2>Por onde eu começo?</h2>
            <ol className="start-list">
              <li><span>1</span><div><strong>Acesse seus sistemas</strong><small>SIGA, e-mail institucional e Wi-Fi.</small></div></li>
              <li><span>2</span><div><strong>Entenda sua rotina</strong><small>Salas, RU, horários e calendário.</small></div></li>
              <li><span>3</span><div><strong>Veja o seu curso</strong><small>Disciplinas e pré-requisitos.</small></div></li>
              <li><span>4</span><div><strong>Encontre sua rede</strong><small>Apoio, projetos e oportunidades.</small></div></li>
            </ol>
            <Link href="/guia/chegada" className="text-link">Abrir roteiro da primeira semana <span aria-hidden="true">→</span></Link>
          </aside>
        </div>
        <div className="hero-band" aria-hidden="true">
          <div className="container hero-band__content">
            <span>Informação que acolhe.</span>
            <span>Organização que dá autonomia.</span>
            <span>Comunidade que abre caminhos.</span>
          </div>
        </div>
      </section>

      <section className="section" id="guia">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Escolha seu ponto de partida</span>
              <h2>Um guia para cada dúvida do começo.</h2>
            </div>
            <p>Vá direto ao que precisa agora. As trilhas foram organizadas para funcionar em qualquer curso de Exatas ou Engenharia.</p>
          </div>
          <div className="guide-grid">
            {guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
          </div>
        </div>
      </section>

      <section className="section section--tint" id="cursos">
        <div className="container courses-grid">
          <div className="courses-copy">
            <span className="eyebrow">Para quem é o HELPIEEE</span>
            <h2>Vários cursos. A mesma sensação de estar começando.</h2>
            <p>O conteúdo atende quem chega ao ICE e à Faculdade de Engenharia, reunindo orientações para diferentes cursos e etapas da graduação.</p>
          </div>
          <div className="course-panels">
            <article className="course-panel">
              <span className="course-panel__mark" aria-hidden="true">∑</span>
              <h3>Ciências Exatas</h3>
              <ul>{exactCourses.map((course) => <li key={course}>{course}</li>)}</ul>
              <a href="https://www2.ufjf.br/ice/ensino/graduacao/cursos-de-graduacao/" target="_blank" rel="noreferrer">Ver cursos do ICE <span aria-hidden="true">↗</span></a>
            </article>
            <article className="course-panel course-panel--blue">
              <span className="course-panel__mark" aria-hidden="true">△</span>
              <h3>Engenharias</h3>
              <ul>{engineeringCourses.map((course) => <li key={course}>{course}</li>)}</ul>
              <a href="https://www2.ufjf.br/engenharia/ensino/cursos/" target="_blank" rel="noreferrer">Ver cursos da Engenharia <span aria-hidden="true">↗</span></a>
            </article>
          </div>
        </div>
      </section>

      <section className="section tools-section">
        <div className="container">
          <div className="section-heading section-heading--light">
            <div>
              <span className="eyebrow">Ferramentas para decidir melhor</span>
              <h2>Veja o caminho, não apenas a próxima matéria.</h2>
            </div>
            <p>Explore pré-requisitos, marque disciplinas concluídas e entenda o que cada escolha desbloqueia.</p>
          </div>
          <div className="tool-feature">
            <div className="tool-feature__copy">
              <span className="tool-feature__tag">10 grades disponíveis</span>
              <h3>Fluxo curricular interativo</h3>
              <p>Uma visão mais simples dos períodos, dependências e progresso do curso — sem abrir planilhas ou caçar códigos em documentos.</p>
              <ul className="check-list">
                <li>Pesquisa por disciplina e código</li>
                <li>Pré-requisitos e desbloqueios</li>
                <li>Progresso salvo somente no seu dispositivo</li>
              </ul>
              <Link className="button button--white" href="/fluxo">Explorar meu fluxo <span aria-hidden="true">→</span></Link>
            </div>
            <div className="flow-preview" aria-hidden="true">
              <div className="flow-preview__top"><span></span><span></span><span></span></div>
              <div className="flow-preview__periods">
                {[1, 2, 3].map((period) => (
                  <div key={period}>
                    <small>{period}º período</small>
                    <i></i><i></i><i></i><i></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container origin-grid">
          <div className="origin-mark">
            <Image
              src="/assets/images/branding/ieee-ufjf.svg"
              alt="Logo do Ramo Estudantil IEEE UFJF"
              width={1024}
              height={1024}
            />
          </div>
          <div>
            <span className="eyebrow">Quem faz</span>
            <h2>Conhecimento compartilhado também é acolhimento.</h2>
            <p>O HELPIEEE é uma iniciativa estudantil ligada ao Ramo IEEE UFJF. Ele organiza o que veteranos gostariam de ter encontrado quando chegaram — com linguagem direta, responsabilidade e espaço para evoluir.</p>
            <div className="button-row">
              <Link className="text-link" href="/guia/projeto">Conheça o projeto <span aria-hidden="true">→</span></Link>
              <a className="text-link" href="https://www.ieeeufjf.com.br/" target="_blank" rel="noreferrer">Visite o IEEE UFJF <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
