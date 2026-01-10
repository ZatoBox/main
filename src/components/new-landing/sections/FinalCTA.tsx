'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ScrollLink from '../ScrollLink';
import '@/lib/i18n';

const FinalCTA = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="px-6 md:px-12 py-24">
      <div
        ref={ref}
        className={`max-w-2xl mx-auto text-center relative transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <Image
          src="/landing/doodle-yes.png"
          alt=""
          className="hidden md:block absolute -left-40 top-1/2 -translate-y-1/2 w-40 opacity-70"
          width={160}
          height={160}
        />

        <div className="flex items-center justify-center gap-3 mb-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            {t('cta.label')}
          </p>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          {t('cta.title')}
        </h2>

        <p className="text-muted-foreground mb-2">{t('cta.desc1')}</p>

        <p className="text-muted-foreground mb-2">
          {t('cta.desc2')} <span className="font-medium">ZatoBox</span>, a
          simple{' '}
          <ScrollLink
            to="#features"
            className="font-medium underline hover:text-foreground transition-colors"
          >
            {t('cta.posInventory')}
          </ScrollLink>{' '}
          {t('cta.desc3')}
        </p>

        <p className="text-muted-foreground mb-8">{t('cta.desc4')}</p>

        <a href="/login">
          <Button size="lg" className="rounded-full px-10 mb-4">
            {t('cta.button')}
          </Button>
        </a>

        <p className="text-xs text-muted-foreground">{t('cta.footer')}</p>
      </div>
    </section>
  );
};

export default FinalCTA;
