'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import '@/lib/i18n';

const HowItWorks = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="px-6 md:px-12 py-24">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            {t('dashboard.label')}
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t('dashboard.title')}
        </h2>

        <p className="text-center text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
          {t('dashboard.desc1')}
        </p>

        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          {t('dashboard.desc2')}
        </p>

        <div className="flex justify-center mb-12">
          <a href="/login">
            <Button size="lg" className="rounded-full px-8">
              {t('dashboard.joinBeta')}
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="aspect-video bg-muted/30 rounded-xl mb-4 flex items-center justify-center p-4 relative">
              <Image
                src="/landing/doodle-inventory.png"
                alt="Store settings illustration"
                className="max-h-full max-w-full object-contain"
                fill
              />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t('dashboard.settingsTitle')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.settingsDesc')}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="aspect-video bg-muted/30 rounded-xl mb-4 flex items-center justify-center p-4 relative">
              <Image
                src="/landing/doodle-dashboard-person.png"
                alt="Dashboard illustration"
                className="max-h-full max-w-full object-contain"
                fill
              />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t('dashboard.alertsTitle')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.alertsDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
