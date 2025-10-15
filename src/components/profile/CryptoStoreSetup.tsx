'use client';

import React, { useState, useEffect } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';

interface UserStore {
  id: string;
  btcpay_store_id: string;
  store_name: string;
  xpub?: string;
  webhook_secret: string;
  created_at: string;
  updated_at: string;
}

const CryptoStoreSetup: React.FC = () => {
  const [store, setStore] = useState<UserStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [xpub, setXpub] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUserStore();
  }, []);

  const loadUserStore = async () => {
    try {
      setLoading(true);
      const response = await btcpayAPI.getUserStore();
      if (response.success && response.store) {
        setStore(response.store);
      }
    } catch (err) {
      console.error('Error loading store:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      setError('El nombre de la tienda es requerido');
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await btcpayAPI.createUserStore({
        storeName: storeName.trim(),
        xpub: xpub.trim() || undefined,
      });

      if (response.success) {
        setSuccess('Tienda creada exitosamente');
        setStore(response.store);
        setStoreName('');
        setXpub('');
      } else {
        setError(response.message || 'Error al crear la tienda');
      }
    } catch (err) {
      setError('Error al crear la tienda');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (store) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Tienda Configurada
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Tu tienda BTCPay está lista para recibir pagos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <label className="text-sm font-medium text-gray-700">
              Nombre de la Tienda
            </label>
            <p className="text-gray-900 mt-1">{store.store_name}</p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <label className="text-sm font-medium text-gray-700">
              Estado de la Wallet
            </label>
            <p className="text-gray-900 mt-1">
              {store.xpub ? 'Wallet Importada' : 'Wallet Generada'}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Los pagos en crypto ahora están disponibles en tu tienda.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">¡Éxito!</h3>
              <p className="text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Tienda *
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Mi Tienda Crypto"
            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={creating}
          />
          <p className="text-xs text-gray-500 mt-1">
            El nombre que aparecerá en BTCPay Server
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            XPUB (Opcional)
          </label>
          <input
            type="text"
            value={xpub}
            onChange={(e) => setXpub(e.target.value)}
            placeholder="xpub..."
            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
            disabled={creating}
          />
          <p className="text-xs text-gray-500 mt-1">
            Si tienes una wallet externa, pega tu XPUB aquí. Si lo dejas vacío,
            se generará una wallet nueva.
          </p>
        </div>

        <button
          onClick={handleCreateStore}
          disabled={creating || !storeName.trim()}
          className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {creating ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Creando tienda...</span>
            </>
          ) : (
            <span>Crear Tienda BTCPay</span>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-400 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">¿Qué hace esto?</h4>
            <p className="text-blue-700">
              Crea una tienda dedicada en BTCPay Server solo para ti. Los pagos
              en Bitcoin irán directamente a tu wallet, sin que nosotros
              tengamos acceso a tus fondos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoStoreSetup;
