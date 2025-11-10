import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { LanguageProvider } from '@/context/language-context';
import { PluginProvider } from '@/context/plugin-context';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { CashSuccessProvider } from '@/context/cash-success-context';
import { CryptoSuccessProvider } from '@/context/crypto-success-context';
import { OCRProvider } from '@/context/ocr-context';
import LayoutWrapper from '@/components/LayoutWrapper';
import CashSuccessPortal from '@/components/CashSuccessPortal';
import CryptoSuccessPortal from '@/components/CryptoSuccessPortal';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://zatobox.io'),
  title: 'ZatoBox',
  description:
    'ZatoBox is an all-in-one platform to digitalize and automate businesses. It integrates point of sale, smart inventory, and Bitcoin-fiat payments into a modular, open ecosystem built to scale with your company.',
  generator: 'ZatoBox',
  openGraph: {
    title: 'ZatoBox',
    description:
      'ZatoBox is an all-in-one platform to digitalize and automate businesses. It integrates point of sale, smart inventory, and Bitcoin-fiat payments into a modular, open ecosystem built to scale with your company.',
    url: 'https://zatobox.io',
    siteName: 'ZatoBox',
    images: [
      {
        url: 'images/logo.png',
        width: 800,
        height: 600,
        alt: 'ZatoBox Logo',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable}`}>
      <body className="antialiased">
        <PluginProvider>
          <OCRProvider>
            <LanguageProvider>
              <AuthProvider>
                <CashSuccessProvider>
                  <CryptoSuccessProvider>
                    <LayoutWrapper>{children}</LayoutWrapper>
                    <CashSuccessPortal />
                    <CryptoSuccessPortal />
                  </CryptoSuccessProvider>
                </CashSuccessProvider>
              </AuthProvider>
            </LanguageProvider>
          </OCRProvider>
        </PluginProvider>
      </body>
    </html>
  );
}
