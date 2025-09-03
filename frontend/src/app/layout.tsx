import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { LanguageProvider } from '@/context/language-context';
import { PluginProvider } from '@/context/plugin-context';

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
    <html lang='es'>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <PluginProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </PluginProvider>
      </body>
    </html>
  );
}
