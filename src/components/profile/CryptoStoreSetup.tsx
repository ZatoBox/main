'use client';

import React, { useState, useEffect } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import { useAuth } from '@/context/auth-store';
import { Edit, Lock } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);

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
        setSuccess('XPUB actualizado exitosamente');
        setXpubData({
          xpub: xpubInput.trim(),
          savedAt: new Date().toISOString(),
        });
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
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
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
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

  const startEditing = () => {
    setXpubInput(xpubData?.xpub || '');
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setXpubInput('');
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-gray-400"></div>
      </div>
    );
  }

  return (
    <>
      {saving && (
        <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-8">
          <div className="flex items-center space-x-3 px-4 py-2 bg-white/90 border border-gray-200 rounded-lg shadow-sm">
            <div className="w-4 h-4 border-b-2 rounded-full animate-spin border-gray-400"></div>
            <span className="text-sm text-gray-700">Guardando...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
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
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
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

      <div className="relative group transition-all duration-200 hover:shadow-sm">
        <div className="p-4 border rounded-lg bg-white border-gray-200 hover:border-orange-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">
                XPUB de Bitcoin
              </label>
            </div>
            {!isEditing && (
              <button
                onClick={startEditing}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
              >
                <Edit className="w-3 h-3" />
                <span>Editar</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={xpubInput}
                  onChange={(e) => setXpubInput(e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 font-mono text-sm"
                  placeholder="xpub1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa..."
                  autoFocus
                  disabled={saving}
                />
              </div>
              <p className="text-xs text-gray-500">
                Proporciona el XPUB de tu wallet para recibir pagos directamente
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveXpub}
                  disabled={saving || !xpubInput.trim()}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-900">
              {xpubData?.xpub ? (
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-gray-500 text-xs break-all">
                    ******
                  </span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
                    Configurado
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 italic">No configurado</span>
              )}
            </div>
          )}
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
    </>
  );
};

export default CryptoStoreSetup;
