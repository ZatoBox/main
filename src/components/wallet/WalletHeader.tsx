import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const WalletHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <span>{t('wallet.header.finance')}</span>
        <ChevronRight size={14} />
        <span className="text-[#F88612] font-medium">
          {t('wallet.header.wallet')}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">
            {t('wallet.header.title')}
          </h1>
          <p className="text-[#64748B]">{t('wallet.header.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
