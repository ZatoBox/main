'use client';

import React, { useState, useEffect } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import { useAuth } from '@/context/auth-store';
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import StoreSetupModal from './StoreSetupModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CryptoStoreSetup: React.FC = () => {
  const { token, initialized } = useAuth();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteReconfirm, setShowDeleteReconfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteStore = async () => {
    try {
      setIsDeleting(true);
      const res = await btcpayAPI.deleteStore(token!);
      if (res.success) {
        setHasWallet(false);
        setStoreId(null);
        setShowDeleteReconfirm(false);
        // Reload to reset state completely
        window.location.reload();
      } else {
        setError(res.message || 'Error al eliminar la store');
      }
    } catch (err) {
      setError('Error al eliminar la store');
    } finally {
      setIsDeleting(false);
    }
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
          <div className="rounded-xl p-6">
            <div>
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

      <div className="flex justify-end pt-4">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          <span>Eliminar Store y Wallet</span>
        </button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará tu tienda y tu wallet del servidor. Perderás
              el acceso a los fondos si no tienes tu frase de recuperación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setShowDeleteConfirm(false);
                setShowDeleteReconfirm(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showDeleteReconfirm}
        onOpenChange={setShowDeleteReconfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              ¡Confirmación Final!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es IRREVERSIBLE. Se borrarán todos los datos de tu
              tienda y wallet de nuestra base de datos y del servidor de pagos.
              ¿Confirmas que quieres eliminar todo permanentemente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleDeleteStore();
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Sí, eliminar todo'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CryptoStoreSetup;
