'use client';

import React from 'react';
import { DollarSign, Bitcoin } from 'lucide-react';

interface Props {
  activeTab: 'cash' | 'crypto';
  onTabChange: (tab: 'cash' | 'crypto') => void;
}

const ReceiptsTabs: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'cash',
      label: 'Efectivo',
      icon: DollarSign,
      description: 'Recibos de pago en efectivo',
    },
    {
      id: 'crypto',
      label: 'Criptomoneda',
      icon: Bitcoin,
      description: 'Recibos de pago en criptomoneda',
    },
  ];

  return (
    <div className="border-b bg-[#FFFFFF] border-[#CBD5E1]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as 'cash' | 'crypto')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2 group ${
                  isActive
                    ? 'border-[#F88612] text-[#F88612]'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-[#EEB131]'
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-all ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReceiptsTabs;
