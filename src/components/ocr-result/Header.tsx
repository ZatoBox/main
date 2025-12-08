import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

type Props = {};

const Header: React.FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <span>{t('ocr.header.breadcrumbTools')}</span>
        <ChevronRight size={14} />
        <span className="text-[#F88612] font-medium">
          {t('ocr.header.breadcrumbOcr')}
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">
          {t('ocr.header.title')}
        </h1>
        <p className="text-[#64748B]">{t('ocr.header.description')}</p>
      </div>
    </div>
  );
};

export default Header;
