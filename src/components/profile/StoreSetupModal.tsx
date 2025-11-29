'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Wallet,
  Store,
  Shield,
  AlertTriangle,
  AlertCircle,
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
  | 'security-warning'
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
  const [fingerprint, setFingerprint] = useState<string | null>(null);

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
      if (data.fingerprint) {
        setFingerprint(data.fingerprint);
      }

      setCurrentStep('security-warning');
    } catch (err: any) {
      setError(err.message || 'Error al crear la wallet');
    } finally {
      setLoading(false);
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

      case 'security-warning':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Asegura tu frase de recuperación
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                La frase de recuperación es una copia de seguridad que te
                permite restaurar tu billetera en caso de que el servidor falle.
                Si la pierdes o la anotas de forma incorrecta, podrías perder
                permanentemente el acceso a tus fondos. No la fotografíes. No la
                almacenes digitalmente. La frase de recuperación también se
                almacenará en el servidor como una hot wallet, en caso de
                cualquier cosa NO podrás volver a ver tu frase semilla en la
                sección Perfil.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-orange-600 mb-2">
                    Consejo de seguridad
                  </h3>
                  <p className="text-sm text-orange-900 leading-relaxed">
                    Dado que las hot wallets están más expuestas a riesgos, te
                    recomendamos mantener solo montos bajos para operaciones
                    diarias y transferir periódicamente los fondos a tu
                    billetera fría para maximizar tu seguridad. Esto reduce el
                    riesgo en caso de que tu servidor o dispositivo sea
                    comprometido.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('show-mnemonic')}
              className="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
            >
              Entendido, mostrar frase
            </button>
          </div>
        );

      case 'show-mnemonic':
        const firstColumn = mnemonic.slice(0, 6);
        const secondColumn = mnemonic.slice(6, 12);

        return (
          <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-center rounded-t-2xl z-10 ">
              <h2 className="text-xl font-bold text-gray-900">
                Asegura tu frase de recuperación
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <AlertTriangle className="w-16 h-16 text-[#F88612]" />

                <div className="space-y-1 max-w-lg mx-auto">
                  <p className="text-gray-900 text-base">
                    La combinación de palabras que ves a continuación se llama
                    frase de recuperación. La frase de recuperación te permite
                    Escríbela en un papel o metal en el orden exacto: acceder y
                    restaurar tu billetera.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-x-12 gap-y-0 w-full max-w-md">
                  <div className="flex flex-col">
                    {firstColumn.map((word, index) => (
                      <div
                        key={index}
                        className="flex items-center py-3 border-b border-gray-200"
                      >
                        <span className="text-lg text-gray-300 w-8 font-medium">
                          {index + 1}.
                        </span>
                        <span className="text-xl text-gray-900 font-normal">
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    {secondColumn.map((word, index) => (
                      <div
                        key={index + 6}
                        className="flex items-center py-3 border-b border-gray-200"
                      >
                        <span className="text-lg text-gray-300 w-8 font-medium">
                          {index + 7}.
                        </span>
                        <span className="text-xl text-gray-900 font-normal">
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {fingerprint && (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-base text-gray-500 font-medium">
                    Master Fingerprint
                  </span>
                  <div className="px-4 py-2 rounded-lg">
                    <code className="text-lg font-mono text-gray-900 tracking-wider">
                      {fingerprint.toUpperCase()}
                    </code>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-gray-500 leading-relaxed space-y-2 max-w-lg mx-auto">
                <p>
                  La frase de recuperación es una copia de seguridad que te
                  permite restaurar tu billetera en caso de que el servidor
                  falle. Si la pierdes o la anotas de forma incorrecta, podrías
                  perder permanentemente el acceso a tus fondos. No la
                  fotografíes. No la almacenes digitalmente. La frase de
                  recuperación también se almacenará en el servidor como una hot
                  wallet.
                </p>
              </div>

              <div className="bg-[#FFF9EC] border border-[#FFE0B2] rounded-xl p-6 space-y-3">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#A94D14]">
                    <AlertTriangle className="w-6 h-6 text-[#A94D14]" />
                  </div>
                  <h3 className="font-bold text-[#F88612]">
                    Consejo de seguridad
                  </h3>
                </div>
                <p className="text-center text-sm text-gray-700 leading-relaxed">
                  Dado que las hot wallet están más expuestas a riesgos, te
                  recomendamos mantener solo montos bajos para operaciones
                  diarias y transferir periódicamente los fondos a tu billetera
                  fría para maximizar tu seguridad. Esto reduce el riesgo en
                  caso de que tu servidor o dispositivo sea comprometido.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 bg-[#F88612] text-white font-bold text-lg rounded-xl hover:bg-[#E67300] transition-colors shadow-sm"
              >
                Hecho
              </button>
            </div>
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
          <div
            className={`relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              currentStep === 'show-mnemonic' ? 'p-0' : 'p-8'
            }`}
          >
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
