import '../globals.css';
import { defaultMetadata } from '@/lib/metadata';

export const metadata = defaultMetadata;

export default function ContentLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="page-content" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
