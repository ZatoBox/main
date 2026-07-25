'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import ResponsiveModal from '@/components/ui/responsive-modal';

interface TransactionHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHelpModal: React.FC<TransactionHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t('wallet.helpModal.title')}
      desktopClassName="max-w-2xl"
      footer={
        <button
          onClick={onClose}
          className="w-full py-3 min-h-11 bg-[#F88612] text-white font-bold rounded-xl hover:bg-[#E67300] transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
        >
          {t('wallet.helpModal.done')}
        </button>
      }
    >
      <div className="space-y-6 pb-2">
        <p className="text-center font-bold text-xs text-[#1E293B]">
          {t('wallet.helpModal.description')}
        </p>

        <div className="relative rounded-[20px] overflow-hidden">
          <img
            src="/images/btrc-transaction.svg"
            alt="BTC Transaction Guide"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-[#F88612] border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7 relative w-full h-auto min-h-[115px] bg-[#F3F5F7] border-2 border-[#CBD5E1] rounded-xl p-3 flex flex-col items-start text-left overflow-hidden group hover:border-[#F88612] transition-colors duration-300">
            <span className="text-black font-semibold text-xs leading-tight mb-1">
              {t('wallet.helpModal.needHelp.title')}
            </span>
            <span className="text-[#6A7282] text-[11px] leading-tight mb-auto pr-12">
              {t('wallet.helpModal.needHelp.description')}
            </span>
            <div className="flex items-center gap-1 text-[#F88612] mt-1 z-10">
              <ArrowRight size={14} />
              <a
                href="mailto:support@zatobox.io"
                className="font-bold text-xs hover:underline"
              >
                support@zatobox.io
              </a>
            </div>
            <img
              src="/images/exclamation-sym.svg"
              alt=""
              className="absolute right-5 top-1/2 -translate-y-1/2"
            />
          </div>

          <div className="sm:col-span-5 relative w-full h-auto min-h-[115px] bg-[#F3F5F7] border-2 border-[#CBD5E1] rounded-xl p-3 flex flex-col items-start text-left overflow-hidden group hover:border-[#F88612] transition-colors duration-300">
            <span className="text-black font-semibold text-xs leading-tight mb-1">
              {t('wallet.helpModal.feedback.title')}
            </span>
            <span className="text-[#6A7282] text-[11px] leading-tight mb-auto pr-4">
              {t('wallet.helpModal.feedback.description')}
            </span>
            <div className="flex items-center gap-1 text-[#F88612] mt-1 z-10">
              <ArrowRight size={14} />
              <button
                onClick={() =>
                  window.open(
                    'https://docs.google.com/forms/d/e/1FAIpQLSfJTvb4AK999EZVWsvaJk_6nFMKw67WrRHDlYhKjfg0fCZoFw/viewform',
                    '_blank'
                  )
                }
                className="font-bold text-xs hover:underline"
              >
                {t('wallet.helpModal.feedback.button')}
              </button>
            </div>
            <img
              src="/images/feedback-geometric-shape.svg"
              alt=""
              className="absolute bottom-0 right-0"
            />
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default TransactionHelpModal;
