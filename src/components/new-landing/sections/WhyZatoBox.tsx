'use client';

import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import '@/lib/i18n';

const WhyZatoBox = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const plans = [
    {
      nameKey: 'pricing.freeBeta',
      trialKey: 'pricing.earlyAccess',
      priceKey: 'pricing.free',
      periodKey: 'pricing.duringBeta',
      ctaKey: 'pricing.joinNow',
      featureKeys: [
        'pricing.fullPos',
        'pricing.inventoryManagement',
        'pricing.transactionHistory',
        'pricing.bitcoinPayments',
      ],
      highlighted: false,
      comingSoon: false,
    },
    {
      nameKey: 'pricing.proPlan',
      trialKey: 'pricing.comingSoon',
      price: '$--',
      period: '/ per month',
      ctaKey: 'pricing.comingSoon',
      featureKeys: [
        'pricing.allFromFree',
        'pricing.ocrScanning',
        'pricing.advancedAnalytics',
        'pricing.prioritySupport',
      ],
      highlighted: true,
      comingSoon: true,
    },
  ];

  return (
    <section id="pricing" className="px-6 md:px-12 py-24 bg-muted/30">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            {t('pricing.label')}
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t('pricing.title')}
        </h2>

        <p className="text-center text-muted-foreground text-lg mb-12">
          {t('pricing.description')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl ${
                plan.highlighted
                  ? 'bg-card border-2 border-foreground'
                  : 'bg-card border border-border'
              }`}
            >
              <p className="text-sm text-muted-foreground mb-1">
                {t(plan.nameKey)}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {t(plan.trialKey)}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price || t(plan.priceKey!)}
                </span>
              </div>

              {plan.comingSoon ? (
                <button
                  className="w-full py-3 px-4 rounded-full text-sm font-medium mb-6 bg-muted text-muted-foreground cursor-not-allowed"
                  disabled
                >
                  {t(plan.ctaKey)}
                </button>
              ) : (
                <a href="/login" className="block mb-6">
                  <button className="w-full py-3 px-4 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors">
                    {t(plan.ctaKey)}
                  </button>
                </a>
              )}

              <div className="space-y-3">
                {plan.featureKeys.map((featureKey, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      {t(featureKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyZatoBox;
