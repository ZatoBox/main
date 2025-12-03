'use client';

import React, { useState } from 'react';
import { Bitcoin, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import StoreSetupModal from '@/components/profile/StoreSetupModal';

interface WalletSetupProps {
  onSetupComplete: () => void;
  token: string;
}

const WalletSetup: React.FC<WalletSetupProps> = ({
  onSetupComplete,
  token,
}) => {
  const [showSetupModal, setShowSetupModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-shrink-0 relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[#FFF4E5] to-[#FFEDD5] rounded-full flex items-center justify-center shadow-inner">
              <Bitcoin className="w-16 h-16 text-[#F88612]" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md border border-[#E2E8F0]">
              <ShieldCheck className="w-6 h-6 text-[#10B981]" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
                Configura tu Billetera Bitcoin
              </h2>
              <p className="text-[#64748B] text-lg leading-relaxed max-w-2xl">
                Para comenzar a recibir y gestionar pagos en Bitcoin, necesitas
                activar tu billetera. Este proceso creará una wallet segura y
                única para tu tienda.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 py-2">
              <div className="flex items-center gap-2 text-[#475569]">
                <CheckCircle size={18} className="text-[#10B981]" />
                <span className="font-medium">Wallet SegWit</span>
              </div>
              <div className="flex items-center gap-2 text-[#475569]">
                <CheckCircle size={18} className="text-[#10B981]" />
                <span className="font-medium">Custodia Propia</span>
              </div>
              <div className="flex items-center gap-2 text-[#475569]">
                <CheckCircle size={18} className="text-[#10B981]" />
                <span className="font-medium">Pagos Automáticos</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={() => setShowSetupModal(true)}
              className="group flex items-center gap-2 px-8 py-4 bg-[#F88612] text-white text-lg font-semibold rounded-xl hover:bg-[#E67300] transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1"
            >
              <span>Activar Wallet</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-8 py-4 flex items-center justify-center md:justify-start gap-2 text-sm text-[#64748B]">
          <ShieldCheck size={16} />
          <span>
            Tus llaves privadas se generan localmente y solo tú tienes acceso a
            ellas.
          </span>
        </div>
      </div>

      <StoreSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onComplete={onSetupComplete}
        token={token}
      />
    </>
  );
};

export default WalletSetup;
