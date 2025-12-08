import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface Props {
  count: number;
  searchTerm?: string;
}

const HomeStats: React.FC<Props> = ({ count, searchTerm }) => {
  const { t } = useTranslation();

  return (
    <p className="text-gray-500 animate-slide-in-right">
      {searchTerm ? (
        <>
          {t('home.stats.showingResults')} {count} {t('home.stats.resultsFor')}{' '}
          "{searchTerm}"
        </>
      ) : (
        t('home.stats.selectProducts')
      )}
    </p>
  );
};

export default HomeStats;
