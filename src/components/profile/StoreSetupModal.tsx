'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Wallet,
  Store,
  Shield,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface StoreSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  token: string;
}

type SetupStep =
  | 'intro'
  | 'creating-store'
  | 'creating-wallet'
  | 'show-mnemonic'
  | 'complete';

const StoreSetupModal: React.FC<StoreSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  token,
}) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [copiedMnemonic, setCopiedMnemonic] = useState(false);

  if (!isOpen) return null;

  const handleCreateStore = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/payments/btcpay/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ createStore: true }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error al crear la store');
      }

      setCurrentStep('creating-wallet');
    } catch (err: any) {
      setError(err.message || 'Error al crear la store');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/payments/btcpay/wallet/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error al crear la wallet');
      }

      if (data.mnemonic) {
        setMnemonic(data.mnemonic.split(' '));
      }

      setCurrentStep('show-mnemonic');
    } catch (err: any) {
      setError(err.message || 'Error al crear la wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMnemonic = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic.join(' '));
      setCopiedMnemonic(true);
      setTimeout(() => setCopiedMnemonic(false), 2000);
    } catch (error) {
      console.error('Error copying mnemonic:', error);
    }
  };

  const handleComplete = () => {
    setCurrentStep('complete');
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Configura tu Store
              </h2>
              <p className="text-gray-600">
                Vamos a crear tu tienda de Bitcoin para que puedas recibir pagos
                en crypto.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-900">
                  <p className="font-medium mb-1">¿Qué vamos a hacer?</p>
                  <ul className="space-y-1 text-orange-800">
                    <li>• Crear tu tienda personal de Bitcoin</li>
                    <li>• Generar una wallet hot wallet con SegWit</li>
                    <li>• Mostrarte las palabras de recuperación</li>
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateStore}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Comenzar'}
              </button>
            </div>
          </div>
        );

      case 'creating-wallet':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Crear Wallet
              </h2>
              <p className="text-gray-600">
                Ahora vamos a crear una hot wallet con SegWit para tu tienda.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Sobre tu wallet</p>
                  <p className="text-blue-800">
                    Crearemos una wallet hot (conectada a internet) con
                    tecnología SegWit para transacciones más rápidas y
                    económicas. Te mostraremos las 12 palabras de recuperación
                    que debes guardar de forma segura.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateWallet}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando Wallet...' : 'Crear Wallet'}
              </button>
            </div>
          </div>
        );

      case 'show-mnemonic':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Palabras de Recuperación
              </h2>
              <p className="text-gray-600">
                Guarda estas 12 palabras en un lugar seguro. Son la única forma
                de recuperar tu wallet.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-900">
                  <p className="font-bold mb-1">⚠️ MUY IMPORTANTE</p>
                  <ul className="space-y-1 text-red-800">
                    <li>• Nunca compartas estas palabras con nadie</li>
                    <li>• Guárdalas en un lugar seguro offline</li>
                    <li>• Si las pierdes, perderás acceso a tus fondos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {mnemonic.map((word, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"
                  >
                    <span className="text-xs text-gray-500 block mb-1">
                      {index + 1}
                    </span>
                    <span className="font-mono font-medium text-gray-900">
                      {word}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCopyMnemonic}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copiedMnemonic ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">
                      Copiar Palabras
                    </span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleComplete}
              className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              He guardado mis palabras de forma segura
            </button>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Todo Listo!
            </h2>
            <p className="text-gray-600">
              Tu store y wallet han sido configuradas correctamente.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-[60] animate-fade-in"
        onClick={currentStep === 'show-mnemonic' ? undefined : onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none p-4">
        <div
          className="animate-scale-in pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {currentStep !== 'show-mnemonic' && currentStep !== 'complete' && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            )}

            {renderStepContent()}
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

export default StoreSetupModal;
