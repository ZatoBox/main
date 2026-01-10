'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Package,
  FileJson,
  Receipt,
  ScanLine,
  PackagePlus,
  Bitcoin,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import '@/lib/i18n';

const ProductOverview = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const tabs = [
    {
      icon: CreditCard,
      titleKey: 'features.pos',
      subtitleKey: 'features.posSubtitle',
      image: '/landing/doodle-bitcoin-cash.png',
      content: {
        titleKey: 'features.posTitle',
        descriptionKey: 'features.posDesc',
      },
    },
    {
      icon: Package,
      titleKey: 'features.inventory',
      subtitleKey: 'features.inventorySubtitle',
      image: '/landing/doodle-boxes.png',
      content: {
        titleKey: 'features.inventoryTitle',
        descriptionKey: 'features.inventoryDesc',
      },
    },
    {
      icon: FileJson,
      titleKey: 'features.bulkImport',
      subtitleKey: 'features.bulkImportSubtitle',
      image: '/landing/doodle-json.png',
      content: {
        titleKey: 'features.bulkImportTitle',
        descriptionKey: 'features.bulkImportDesc',
      },
    },
    {
      icon: Receipt,
      titleKey: 'features.history',
      subtitleKey: 'features.historySubtitle',
      image: '/landing/doodle-history.png',
      content: {
        titleKey: 'features.historyTitle',
        descriptionKey: 'features.historyDesc',
      },
    },
    {
      icon: ScanLine,
      titleKey: 'features.ocr',
      subtitleKey: 'features.ocrSubtitle',
      image: '/landing/doodle-ocr.png',
      content: {
        titleKey: 'features.ocrTitle',
        descriptionKey: 'features.ocrDesc',
      },
    },
    {
      icon: PackagePlus,
      titleKey: 'features.restock',
      subtitleKey: 'features.restockSubtitle',
      image: '/landing/doodle-restock.png',
      content: {
        titleKey: 'features.restockTitle',
        descriptionKey: 'features.restockDesc',
      },
    },
    {
      icon: Bitcoin,
      titleKey: 'features.bitcoin',
      subtitleKey: 'features.bitcoinSubtitle',
      image: '/landing/doodle-bitcoin.png',
      content: {
        titleKey: 'features.bitcoinTitle',
        descriptionKey: 'features.bitcoinDesc',
      },
    },
  ];

  return (
    <section id="features" className="px-6 md:px-12 py-24 bg-muted/30">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">
            {t('features.label')}
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
          {t('features.title')}
        </h2>

        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          {t('features.description')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {tabs.slice(0, 4).map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`p-4 rounded-xl text-left transition-all ${
                activeTab === index
                  ? 'bg-card border-2 border-foreground shadow-sm'
                  : 'bg-card border border-border hover:border-muted-foreground'
              }`}
            >
              <tab.icon
                className={`w-5 h-5 mb-2 ${
                  activeTab === index
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              />
              <p
                className={`font-medium text-sm ${
                  activeTab === index ? 'text-foreground' : 'text-foreground'
                }`}
              >
                {t(tab.titleKey)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(tab.subtitleKey)}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t(tabs[activeTab].content.titleKey)}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t(tabs[activeTab].content.descriptionKey)}
              </p>
            </div>
            <div className="w-full md:w-1/2 aspect-video bg-muted/50 rounded-xl overflow-hidden relative">
              <Image
                src={tabs[activeTab].image}
                alt={t(tabs[activeTab].content.titleKey)}
                className="w-full h-full object-contain transition-opacity duration-300"
                fill
                key={activeTab}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {tabs.slice(4).map((tab, index) => (
            <button
              key={index + 4}
              onClick={() => setActiveTab(index + 4)}
              className={`p-4 rounded-xl text-left transition-all ${
                activeTab === index + 4
                  ? 'bg-card border-2 border-foreground shadow-sm'
                  : 'bg-card border border-border hover:border-muted-foreground'
              }`}
            >
              <tab.icon
                className={`w-5 h-5 mb-2 ${
                  activeTab === index + 4
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              />
              <p
                className={`font-medium text-sm ${
                  activeTab === index + 4
                    ? 'text-foreground'
                    : 'text-foreground'
                }`}
              >
                {t(tab.titleKey)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(tab.subtitleKey)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductOverview;
