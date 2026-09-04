import { Open_Sans } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { INITIAL_THEME_SCRIPT } from '@/lib/theme';

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
    <html
      className={openSans.variable}
      data-scroll-behavior="smooth"
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INITIAL_THEME_SCRIPT }} />
      </head>
      <body>
        <SiteHeader />
        <main id="conteudo-principal">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
