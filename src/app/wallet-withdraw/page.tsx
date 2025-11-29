'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-store';
import { btcpayAPI } from '@/services/btcpay.service';
import { AlertCircle } from 'lucide-react';
import Loader from '@/components/ui/Loader';
import WalletSetup from '@/components/wallet/WalletSetup';
import WalletSend from '@/components/wallet/WalletSend';
import WalletHeader from '@/components/wallet/WalletHeader';

const WalletPage: React.FC = () => {
  const router = useRouter();
  const { token, initialized } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && !token) {
      router.push('/login');
      return;
    }

    if (initialized && token) {
      loadStore();
    }
  }, [token, initialized, router]);

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
      setError('Error al cargar la configuración de la wallet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Cargando wallet..." />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <WalletHeader />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p>{error}</p>
            <button
              onClick={loadStore}
              className="ml-auto text-sm font-semibold hover:underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {!hasWallet ? (
          <WalletSetup onSetupComplete={loadStore} token={token!} />
        ) : (
          <WalletSend token={token!} onSuccess={loadStore} />
        )}
      </div>
    </div>
  );
};

export default WalletPage;
