'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, X, Loader2, Copy, Check } from 'lucide-react';

interface BTCPayModalProps {
  isOpen: boolean;
  invoiceId: string;
  amount: string;
  currency: string;
  paymentUrl: string;
  status: string;
  onClose: () => void;
  onConfirmPayment?: (invoiceId: string) => void;
}

const BTCPayModal: React.FC<BTCPayModalProps> = ({
  isOpen,
  invoiceId,
  amount,
  currency,
  paymentUrl,
  status,
  onClose,
  onConfirmPayment,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getBitcoinAddress = (url: string): string => {
    if (url.startsWith('bitcoin:')) {
      return url.split('?')[0].replace('bitcoin:', '');
    }
    return url;
  };

  const getBIP21URI = (url: string, amt: string): string => {
    const address = getBitcoinAddress(url);
    if (!address) return url;

    if (url.includes('?amount=')) {
      return url;
    }

    if (currency === 'BTC' || currency === 'SATS') {
      return `bitcoin:${address}?amount=${amt}`;
    }

    return `bitcoin:${address}`;
  };

  useEffect(() => {
    if (isOpen && paymentUrl && canvasRef.current) {
      generateQR(paymentUrl);
    }
  }, [isOpen, paymentUrl]);

  const generateQR = async (data: string) => {
    try {
      const QRCode = (await import('qrcode')).default;
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, data, {
          width: 280,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        const dataUrl = canvas.toDataURL();
        setQrDataUrl(dataUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleConfirmPayment = async () => {
    if (onConfirmPayment) {
      setIsConfirming(true);
      try {
        await onConfirmPayment(invoiceId);
      } finally {
        setIsConfirming(false);
      }
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'New':
        return {
          text: 'Esperando confirmación…',
          icon: <Loader2 className="animate-spin text-[#F88612]" size={24} />,
        };
      case 'Processing':
        return {
          text: 'Procesando pago…',
          icon: <Loader2 className="animate-spin text-[#F88612]" size={24} />,
        };
      case 'Settled':
        return {
          text: '¡Pago confirmado!',
          icon: <CheckCircle2 className="text-green-500" size={24} />,
        };
      default:
        return {
          text: 'Esperando pago…',
          icon: <Loader2 className="animate-spin text-[#F88612]" size={24} />,
        };
    }
  };

  if (!isOpen) return null;

  const statusDisplay = getStatusDisplay();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-[60] animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none p-4">
        <div
          className="animate-scale-in pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-900">
                Pago con Bitcoin
              </h2>

              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <canvas ref={canvasRef} className="block" />
              </div>

              <div className="w-full space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 text-center mb-1">
                    Monto a pagar
                  </p>
                  <p className="text-2xl font-bold text-center text-gray-900">
                    {amount} {currency}
                  </p>
                </div>

                <div className="bg-[#FEF9EC] rounded-lg p-4 border border-[#EEB131]">
                  <p className="text-sm text-[#F88612] text-center mb-2">
                    Dirección de pago
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono text-gray-700 break-all flex-1">
                      {getBitcoinAddress(paymentUrl)}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-[#FEF9EC] rounded-lg transition-colors flex-shrink-0"
                      title="Copiar dirección"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} className="text-[#F88612]" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 py-4">
                  {statusDisplay.icon}
                  <span className="text-lg font-medium text-gray-700">
                    {statusDisplay.text}
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 border-t pt-4 w-full">
                <p className="mb-1">Escanea el código QR para pagar</p>
                <p className="text-xs text-gray-400">ID: {invoiceId}</p>
              </div>

              {status === 'New' && (
                <button
                  onClick={handleConfirmPayment}
                  disabled={isConfirming}
                  className="w-full py-3 px-4 bg-[#F88612] text-white font-medium rounded-lg hover:bg-[#d17110] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isConfirming ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    'Confirmar Pago'
                  )}
                </button>
              )}
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

export default BTCPayModal;
