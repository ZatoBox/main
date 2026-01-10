'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import '@/lib/i18n';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-12 pt-24 pb-12 relative overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        <Image
          src="/landing/hero-bg-pattern.svg"
          alt=""
          fill
          className="w-full h-auto md:h-full md:w-full object-contain md:object-cover opacity-25 md:opacity-30"
          priority
        />
      </div>
      <Image
        src="/landing/hero-pattern.svg"
        alt=""
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none select-none z-[1]"
        aria-hidden="true"
        width={1920}
        height={400}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <p className="text-lg md:text-xl text-muted-foreground italic mb-4 font-serif">
          {t('hero.clarity')}
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          {t('hero.title1')}
          <br />
          <span className="text-foreground">{t('hero.title2')}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('hero.description')}
        </p>
      </div>

      <div className="relative w-full max-w-4xl mx-auto z-10">
        <div className="relative z-10 bg-card rounded-2xl shadow-lg border border-border p-6 mx-auto max-w-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {t('hero.pos')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('hero.posDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {t('hero.inventory')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('hero.inventoryDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {t('hero.visibility')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('hero.visibilityDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {t('hero.noComplexity')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('hero.noComplexityDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 group">
          <a
            href="/login"
            className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-primary hover:text-primary-foreground"
            aria-label={t('hero.joinNow')}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
              />
            </svg>
          </a>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {t('hero.joinNow')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
