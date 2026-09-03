import Link from 'next/link';

function formatReviewDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function ResourceLink({ link }) {
  const content = <>{link.label}<span aria-hidden="true">{link.kind === 'internal' ? ' →' : ' ↗'}</span></>;
  if (link.kind === 'internal' || link.href.startsWith('/')) {
    return <Link href={link.href}>{content}</Link>;
  }
  return <a href={link.href} target="_blank" rel="noreferrer">{content}</a>;
}

export function GuideArticle({ guide, nextGuide }) {
  const reviewedAt = formatReviewDate(guide.reviewedAt);

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Navegação estrutural">
            <Link href="/">Início</Link><span aria-hidden="true">/</span>
            <Link href="/guia">Guia</Link><span aria-hidden="true">/</span>
            <span>{guide.title}</span>
          </nav>
          <span className="eyebrow">{guide.eyebrow}</span>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
          <div className="article-scope">
            {guide.audience ? <span>{guide.audience}</span> : null}
            {guide.scope ? <span>{guide.scope}</span> : null}
          </div>
        </div>
      </header>

      <div className="container article-shell">
        <aside className="article-toc">
          <strong>Nesta página</strong>
          <nav aria-label={`Seções de ${guide.title}`}>
            {guide.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
          </nav>
          <div className="article-trust">
            <strong>Conteúdo revisado</strong>
            {reviewedAt ? <span>{reviewedAt}</span> : null}
            {guide.sourceLabel ? <span>Base: {guide.sourceLabel}</span> : null}
          </div>
        </aside>

        <article className="article-content">
          {guide.sections.map((section) => (
            <section className="article-section" id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.summary ? <p>{section.summary}</p> : null}
              {(section.paragraphs ?? []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

              {section.items?.length ? (
                <div className="article-items">
                  {section.items.map((item) => (
                    <section className="article-item" key={`${section.id}-${item.title}`}>
                      <h3>{item.title}</h3>
                      {item.text ? <p>{item.text}</p> : null}
                      {item.list?.length ? <ul>{item.list.map((entry) => <li key={entry}>{entry}</li>)}</ul> : null}
                      {item.links?.length ? (
                        <div className="article-links">
                          {item.links.map((link) => <ResourceLink link={link} key={`${link.href}-${link.label}`} />)}
                        </div>
                      ) : null}
                      {item.sourceLabel || item.reviewedAt ? (
                        <small className="article-item__source">
                          {item.sourceLabel ? `Fonte: ${item.sourceLabel}` : ''}
                          {item.sourceLabel && item.reviewedAt ? ' · ' : ''}
                          {item.reviewedAt ? `revisado em ${formatReviewDate(item.reviewedAt)}` : ''}
                        </small>
                      ) : null}
                    </section>
                  ))}
                </div>
              ) : null}
            </section>
          ))}

          {nextGuide ? (
            <Link className="next-guide" href={`/guia/${nextGuide.slug}`}>
              <span><small>Próxima trilha</small><strong>{nextGuide.title}</strong></span>
              <b aria-hidden="true">→</b>
            </Link>
          ) : null}
        </article>
      </div>
    </>
  );
}
