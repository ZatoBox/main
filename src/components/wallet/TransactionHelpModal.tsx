'use client';

import React from 'react';
import { X, ArrowRight } from 'lucide-react';

interface TransactionHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHelpModal: React.FC<TransactionHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'modalPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1E293B] decoration-gray-300">
              ¿No ves tu transacción?
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-center font-bold text-xs text-[#1E293B]">
            Puede que necesites ajustar el gap limit, el starting index o el
            batch size en tu gestor de wallet para encontrar todas tus
            direcciones
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

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7 relative w-full h-[115px] bg-[#F3F5F7] border-2 border-[#CBD5E1] rounded-xl p-3 flex flex-col items-start text-left overflow-hidden group hover:border-[#F88612] transition-colors duration-300">
              <span className="text-black font-semibold text-xs leading-tight mb-1">
                ¿Necesitas ayuda?
              </span>
              <span className="text-[#6A7282] text-[11px] leading-tight mb-auto pr-12">
                Si tienes problemas con el rescaneo o no <br />
                ves tu transacción, nuestro equipo puede <br />
                ayudarte.
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

            <div className="col-span-5 relative w-full h-[115px] bg-[#F3F5F7] border-2 border-[#CBD5E1] rounded-xl p-3 flex flex-col items-start text-left overflow-hidden group hover:border-[#F88612] transition-colors duration-300">
              <span className="text-black font-semibold text-xs leading-tight mb-1">
                Queremos tu opinión
              </span>
              <span className="text-[#6A7282] text-[11px] leading-tight mb-auto pr-4">
                Estamos mejorando tu experiencia y tu opinión es clave ayúdanos
                a construir la próxima mejora
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
                  Dejar feedback
                </button>
              </div>
              <img
                src="/images/feedback-geometric-shape.svg"
                alt=""
                className="absolute bottom-0 right-0"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#F88612] text-white font-bold rounded-xl hover:bg-[#E67300] transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            Hecho
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalPopIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          50% {
            transform: scale(1.02) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionHelpModal;
