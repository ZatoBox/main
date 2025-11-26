import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';

const WalletHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <span>Finanzas</span>
        <ChevronRight size={14} />
        <span className="text-[#F88612] font-medium">Wallet</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#FFF4E5] rounded-lg border border-[#FFE0B2]">
          <Wallet className="w-6 h-6 text-[#F88612]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Tu Billetera</h1>
          <p className="text-[#64748B]">
            Gestiona tus fondos y realiza retiros seguros
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
