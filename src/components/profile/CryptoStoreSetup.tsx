'use client';

import React, { useState, useEffect } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import { useAuth } from '@/context/auth-store';

interface XpubData {
  xpub: string | null;
  savedAt?: string;
}

const CryptoStoreSetup: React.FC = () => {
  const { token, initialized } = useAuth();
  const [xpubData, setXpubData] = useState<XpubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [xpubInput, setXpubInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialized) {
      loadUserXpub();
    }
  }, [token, initialized]);

  const loadUserXpub = async () => {
    if (!token || !initialized) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await btcpayAPI.getXpub(token);
      if (response.success) {
        setXpubData({ xpub: response.xpub || null });
      }
    } catch (err) {
      console.error('Error loading XPUB:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateXpub = async () => {
    if (!token) {
      setError('Token no disponible');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await btcpayAPI.generateWallet(token);

      if (response.success && response.xpub) {
        setSuccess('XPUB generado automáticamente');
        setXpubData({
          xpub: response.xpub,
          savedAt: new Date().toISOString(),
        });
      } else {
        setError(response.message || 'Error al generar XPUB');
      }
    } catch (err) {
      setError('Error al generar XPUB');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveXpub = async () => {
    if (!token) {
      setError('Token no disponible');
      return;
    }

    if (!xpubInput.trim()) {
      setError('El XPUB no puede estar vacío');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await btcpayAPI.saveXpub(
        { xpub: xpubInput.trim() },
        token
      );

      if (response.success) {
        setSuccess('XPUB guardado exitosamente');
        setXpubData({
          xpub: xpubInput.trim(),
          savedAt: new Date().toISOString(),
        });
        setXpubInput('');
      } else {
        setError(response.message || 'Error al guardar XPUB');
      }
    } catch (err) {
      setError('Error al guardar XPUB');
      console.error(err);
    } finally {
      setSaving(false);
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

  if (xpubData?.xpub) {
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
                XPUB Configurado
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Tu wallet está lista para recibir pagos en Bitcoin
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <label className="text-sm font-medium text-gray-700">Tu XPUB</label>
          <p className="text-gray-900 mt-1 font-mono text-xs break-all">
            {xpubData.xpub}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Los pagos en crypto que recibas irán directamente a tu wallet.
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
            Tu XPUB de Bitcoin *
          </label>
          <input
            type="text"
            value={xpubInput}
            onChange={(e) => setXpubInput(e.target.value)}
            placeholder="xpub1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa..."
            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
            disabled={saving}
          />
          <p className="text-xs text-gray-500 mt-1">
            Proporciona el XPUB de tu wallet para recibir pagos directamente en
            ella
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSaveXpub}
            disabled={saving || !xpubInput.trim()}
            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {saving ? (
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
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar XPUB</span>
            )}
          </button>

          <button
            onClick={handleGenerateXpub}
            disabled={saving}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {saving ? (
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
                <span>Generando...</span>
              </>
            ) : (
              <span>Generar Automático</span>
            )}
          </button>
        </div>
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
              Al proporcionar tu XPUB, cualquier pago en Bitcoin que recibas irá
              directamente a tu wallet. Nosotros solo procesamos y monitoreamos
              la transacción, pero nunca tenemos acceso a tus fondos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoStoreSetup;
