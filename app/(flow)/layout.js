import '../globals.css';
import { defaultMetadata } from '@/lib/metadata';

export const metadata = defaultMetadata;

export default function FlowLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="page-flow" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
