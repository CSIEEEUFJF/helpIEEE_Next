import Link from 'next/link';

export default function NotFound() {
  return <div className="not-found"><div><span className="eyebrow">Erro 404</span><h1>Página não encontrada.</h1><p>O endereço pode ter mudado durante a renovação do HELPIEEE.</p><Link className="button button--primary" href="/">Voltar para o início</Link></div></div>;
}
