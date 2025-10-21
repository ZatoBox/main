'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useCashSuccess } from '@/context/cash-success-context';

const CashSuccessPortal: React.FC = () => {
  const { isOpen, orderId, hideModal } = useCashSuccess();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(hideModal, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hideModal]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-40 animate-fade-in"
        onClick={hideModal}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div
          className="animate-scale-in pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <button
              onClick={hideModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
                <CheckCircle2 size={80} className="text-green-500 relative" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              ¡Pago Completado!
            </h2>

            <p className="text-center text-gray-600 mb-6">
              Tu orden ha sido procesada correctamente en caja.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 text-center">ID de Orden</p>
                <p className="text-lg font-mono font-bold text-center text-gray-900 break-all">
                  {orderId.substring(0, 12)}...
                </p>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              Esta ventana se cerrará automáticamente
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
};

export default CashSuccessPortal;
