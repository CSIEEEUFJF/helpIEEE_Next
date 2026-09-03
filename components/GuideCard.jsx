import Link from 'next/link';

const guideIcons = {
  chegada: '01',
  faculdade: '02',
  estudos: '03',
  comunidade: '04',
  oportunidades: '05',
  projeto: '06',
};

export function GuideCard({ guide, compact = false }) {
  return (
    <Link className={`guide-card${compact ? ' guide-card--compact' : ''}`} href={`/guia/${guide.slug}`}>
      <span className="guide-card__number" aria-hidden="true">
        {guideIcons[guide.slug] ?? '→'}
      </span>
      <span className="guide-card__content">
        <span className="eyebrow">{guide.eyebrow}</span>
        <strong>{guide.title}</strong>
        <span>{guide.summary}</span>
      </span>
      <span className="guide-card__arrow" aria-hidden="true">→</span>
    </Link>
  );
}
