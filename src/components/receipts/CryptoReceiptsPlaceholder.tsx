'use client';

import React from 'react';
import { Bitcoin } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const CryptoReceiptsPlaceholder: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-12 text-center border border-[#CBD5E1] rounded-lg shadow-sm bg-[#FFFFFF] border-dashed">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FEF9EC] to-[#FFF5E6] border border-[#EEB131] rounded-lg">
        <Bitcoin size={32} className="text-[#F88612]" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-text-primary">
        {t('receipts.crypto.title')}
      </h3>
      <p className="text-text-secondary mb-4">
        {t('receipts.crypto.description')}
      </p>
      <div className="inline-block px-4 py-2 text-sm font-medium text-[#F88612] bg-[#FEF9EC] border border-[#EEB131] rounded-lg">
        {t('receipts.crypto.comingSoon')}
      </div>
    </div>
  );
};

export default CryptoReceiptsPlaceholder;
