import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://zatobox.io'),
  title: 'ZatoBox - Free POS & Inventory System for Small Stores',
  description:
    'ZatoBox is a free point of sale for small physical stores. Track sales, manage stock in real time, with optional Bitcoin payments.',
  generator: 'ZatoBox',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ZatoBox - Free POS & Inventory System for Small Stores',
    description:
      'ZatoBox is a free point of sale for small physical stores. Track sales, manage stock in real time, with optional Bitcoin payments.',
    url: 'https://zatobox.io',
    siteName: 'ZatoBox',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZatoBox - Free POS & Inventory System',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZatoBox - Free POS & Inventory System for Small Stores',
    description:
      'ZatoBox is a free point of sale for small physical stores. Track sales, manage stock in real time, with optional Bitcoin payments.',
    images: ['/og-image.png'],
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
