'use client';

import React from 'react';
import { DollarSign, FileText, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface Props {
  totalReceipts: number;
  totalAmount: number;
  completedReceipts: number;
}

const ReceiptsStats: React.FC<Props> = ({
  totalReceipts,
  totalAmount,
  completedReceipts,
}) => {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('receipts.statsLabels.totalReceipts'),
      value: totalReceipts,
      icon: FileText,
      textColor: 'text-[#F88612]',
    },
    {
      label: t('receipts.statsLabels.totalAmount'),
      value: `$${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      textColor: 'text-[#F88612]',
    },
    {
      label: t('receipts.statsLabels.completed'),
      value: completedReceipts,
      icon: TrendingUp,
      textColor: 'text-[#F88612]',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6B7280] mb-1">
                  {stat.label}
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold ${stat.textColor}`}
                >
                  {stat.value}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <Icon size={24} className={stat.textColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReceiptsStats;
