'use client';

import React from 'react';
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface Props {
  onBack: () => void;
}

const ReceiptsHeader: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span>{t('receipts.header.breadcrumbFinances')}</span>
            <ChevronRight size={14} />
            <span className="text-[#F88612] font-medium">
              {t('receipts.header.breadcrumbReceipts')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 transition-colors rounded-full hover:bg-gray-100 md:hidden"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">
                {t('receipts.header.title')}
              </h1>
              <p className="text-[#64748B]">
                {t('receipts.header.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsHeader;
