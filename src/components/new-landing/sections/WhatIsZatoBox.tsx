'use client';

import { useTranslation } from 'react-i18next';
import { Store, Package, TrendingUp } from 'lucide-react';
import '@/lib/i18n';

const WhatIsZatoBox = () => {
  const { t } = useTranslation();

  return (
    <section id="what-is-zatobox" className="px-6 md:px-12 py-16 bg-muted/30">
      <article className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
          {t('whatIs.title')}
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground text-center mb-12 leading-relaxed max-w-3xl mx-auto">
          {t('whatIs.definition')}
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 border border-border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('whatIs.whatTitle')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('whatIs.whatDesc')}
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('whatIs.forWhoTitle')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('whatIs.forWhoDesc')}
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('whatIs.solvesTitle')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('whatIs.solvesDesc')}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default WhatIsZatoBox;
