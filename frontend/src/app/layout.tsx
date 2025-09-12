import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { LanguageProvider } from '@/context/language-context';
import { PluginProvider } from '@/context/plugin-context';
import { AuthProvider } from '@/components/auth/AuthProvider';
import LayoutWrapper from '@/components/LayoutWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZatoBox',
  description: 'Programming made easy',
  generator: 'ZatoBox',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' className={`${GeistSans.variable}`}>
      <body className='antialiased'>
        <PluginProvider>
          <LanguageProvider>
            <AuthProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </AuthProvider>
          </LanguageProvider>
        </PluginProvider>
      </body>
    </html>
  );
}
