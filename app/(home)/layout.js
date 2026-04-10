import '../globals.css';
import { defaultMetadata } from '@/lib/metadata';

export const metadata = defaultMetadata;

export default function HomeLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="page-home" id="top" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
