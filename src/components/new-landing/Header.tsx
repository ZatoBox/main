'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import '@/lib/i18n';

const LandingHeader = () => {
  const { t, i18n } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 bg-background">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Image
          src="/landing/zatobox-logo.png"
          alt="ZatoBox"
          className="h-8 md:h-10 w-auto"
          width={160}
          height={40}
        />

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isMounted ? (i18n.language === 'es' ? 'ES' : 'EN') : 'ES'}
              </span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px]">
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
                  isMounted && i18n.language === 'en' ? 'bg-muted' : ''
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
                  !isMounted || i18n.language === 'es' ? 'bg-muted' : ''
                }`}
              >
                Español
              </button>
            </div>
          </div>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfJTvb4AK999EZVWsvaJk_6nFMKw67WrRHDlYhKjfg0fCZoFw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            {isMounted ? t('header.sendFeedback') : 'Enviar Comentarios'}
          </a>

          <Link href="/login">
            <Button variant="default" size="sm" className="rounded-full px-5">
              {isMounted ? t('header.joinBeta') : 'Probar gratis'}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
