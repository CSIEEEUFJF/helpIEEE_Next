import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Página não encontrada.</h1>
      <p>Verifique o caminho ou volte para a página inicial do HELPIEEE.</p>
      <Link href="/index.html">Voltar para o início</Link>
    </main>
  );
}
