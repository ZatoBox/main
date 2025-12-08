'use client';

import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface FeaturedSectionProps {
  plugins: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  getPriceBadge: (price: string) => React.ReactNode;
  onToggle: (id: string) => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  plugins,
  getStatusBadge,
  getPriceBadge,
  onToggle,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-black">
        {t('pluginStore.featured.title')}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
        {plugins.slice(0, 3).map((plugin) => {
          return (
            <div
              key={plugin.id}
              className="w-full min-w-0 overflow-hidden transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl"
            >
              {plugin.screenshot && (
                <div className="h-32 sm:h-48 overflow-hidden bg-white">
                  <img
                    src={plugin.screenshot}
                    alt={plugin.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-2 sm:gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">
                    {plugin.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-black truncate">
                      {plugin.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#a8a8a8] line-clamp-2">
                      {plugin.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {getStatusBadge(plugin.status)}
                    {getPriceBadge(plugin.price)}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-xs sm:text-sm text-zatobox-600">
                      {plugin.rating}
                    </span>
                    <span className="text-xs sm:text-sm text-zatobox-600">
                      ({plugin.installs})
                    </span>
                  </div>
                </div>
                {plugin.status === 'active' ? (
                  <button
                    onClick={() => onToggle(plugin.id)}
                    className="w-full px-4 py-2 font-medium text-red-800 transition-colors bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    {t('pluginStore.buttons.deactivate')}
                  </button>
                ) : plugin.status === 'inactive' ? (
                  <button
                    onClick={() => onToggle(plugin.id)}
                    className="w-full px-4 py-2 font-medium text-green-800 transition-colors bg-green-100 rounded-lg hover:bg-green-200"
                  >
                    {t('pluginStore.buttons.activate')}
                  </button>
                ) : plugin.status === 'coming-soon' ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                  >
                    {t('pluginStore.buttons.inDevelopment')}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2 font-medium text-yellow-800 bg-yellow-100 rounded-lg cursor-not-allowed"
                  >
                    {t('pluginStore.buttons.inMaintenance')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedSection;
