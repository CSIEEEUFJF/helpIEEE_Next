import { Open_Sans } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://help.ieeeufjf.com.br';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'HELPIEEE — Guia de Exatas e Engenharias da UFJF',
    template: '%s | HELPIEEE',
  },
  description:
    'Um guia feito por estudantes para ajudar calouros de Exatas e Engenharias da UFJF a entender a universidade, organizar os estudos e encontrar oportunidades.',
  icons: {
    icon: '/assets/images/branding/helpieee-favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'HELPIEEE',
    title: 'HELPIEEE — Comece a UFJF com direção',
    description: 'Guia de acolhimento para calouros de Exatas e Engenharias da UFJF.',
    images: [
      {
        url: '/og.png',
        width: 1735,
        height: 906,
        alt: 'HELPIEEE — Comece a UFJF com direção.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HELPIEEE — Comece a UFJF com direção',
    description: 'Guia de acolhimento para calouros de Exatas e Engenharias da UFJF.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={openSans.variable}>
      <body>
        <SiteHeader />
        <main id="conteudo-principal">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
