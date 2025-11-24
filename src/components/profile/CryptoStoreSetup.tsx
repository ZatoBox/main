'use client';

import React, { useState, useEffect } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import { useAuth } from '@/context/auth-store';
import { Bitcoin } from 'lucide-react';

const CryptoStoreSetup: React.FC = () => {
  const { token, initialized } = useAuth();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const res = await btcpayAPI.getXpub(token!);
      const ensureRes = await btcpayAPI.ensureStore(token!);

      if (ensureRes.success && ensureRes.storeId) {
        setStoreId(ensureRes.storeId);
      } else {
        setError(ensureRes.message || 'Failed to load store');
      }
    } catch (err) {
      console.error('Error loading store:', err);
      setError('Failed to load store configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadStore}
          className="mt-2 text-sm text-red-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!storeId) {
    return <div>No store configuration available.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Bitcoin className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-900">
              Configuración de Bitcoin
            </h3>
            <p className="text-sm text-orange-800 mt-1">
              Configura tu wallet de Bitcoin directamente aquí. Esta es tu
              tienda personal. Cualquier cambio se guardará automáticamente.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <iframe
          src={`/api/payments/btcpay-proxy/stores/${storeId}/onchain/BTC`}
          className="w-full h-[800px] border-0"
          title="BTCPay Store Setup"
        />
      </div>
    </div>
  );
};

export default CryptoStoreSetup;
