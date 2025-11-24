'use client';

import React, { useState, useEffect } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import { useAuth } from '@/context/auth-store';
import { Bitcoin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import StoreSetupModal from './StoreSetupModal';
import WalletSendFunds from './WalletSendFunds';

const CryptoStoreSetup: React.FC = () => {
  const { token, initialized } = useAuth();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (initialized && token) {
      loadStore();
    } else if (initialized && !token) {
      setLoading(false);
    }
  }, [token, initialized]);

  const loadStore = async () => {
    try {
      setLoading(true);
      setError(null);

      const storeRes = await btcpayAPI.getXpub(token!);

      if (storeRes.success) {
        setHasWallet(!!storeRes.xpub);

        const ensureRes = await btcpayAPI.ensureStore(token!);
        if (ensureRes.success && ensureRes.storeId) {
          setStoreId(ensureRes.storeId);
        }
      }
    } catch (err) {
      console.error('Error loading store:', err);
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    loadStore();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          <span className="text-gray-600">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={loadStore}
              className="mt-2 text-sm text-red-600 underline hover:text-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasWallet) {
    return (
      <>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bitcoin className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Configura tu Store de Bitcoin
                </h3>
                <p className="text-gray-700 mb-4">
                  Para comenzar a recibir pagos en Bitcoin, necesitas configurar
                  tu tienda y crear una wallet. Este proceso es rápido y seguro.
                </p>
                <div className="bg-white/60 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    ¿Qué incluye?
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Creación de tu tienda personal en BTCPay</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Generación de wallet hot con SegWit</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>12 palabras de recuperación seguras</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Configuración automática de pagos</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
                >
                  Termina de settear tu store
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Importante</p>
                <p className="text-blue-800">
                  Todos los pagos en Bitcoin que recibas irán automáticamente a
                  esta wallet. Asegúrate de guardar las palabras de recuperación
                  en un lugar seguro.
                </p>
              </div>
            </div>
          </div>
        </div>

        <StoreSetupModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onComplete={handleSetupComplete}
          token={token!}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-900 mb-1">
              ✓ Store Configurada
            </h3>
            <p className="text-sm text-green-800">
              Tu tienda de Bitcoin está lista. Todos los pagos en crypto se
              procesarán automáticamente a través de tu wallet.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Bitcoin className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-900">
              Configuración de Bitcoin
            </h3>
            <p className="text-sm text-orange-800 mt-1">
              Puedes gestionar tu wallet de Bitcoin directamente aquí. Esta es
              tu tienda personal.
            </p>
          </div>
        </div>
      </div>

      {storeId && (
        <div className="mt-8">
          <WalletSendFunds token={token!} onSuccess={loadStore} />
        </div>
      )}
    </div>
  );
};

export default CryptoStoreSetup;
