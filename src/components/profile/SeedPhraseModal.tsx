'use client';

import React, { useState } from 'react';
import { X, Lock, AlertTriangle, Eye } from 'lucide-react';

interface SeedPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  seedPhrase: string[];
  masterFingerprint: string;
}

const SeedPhraseModal: React.FC<SeedPhraseModalProps> = ({
  isOpen,
  onClose,
  seedPhrase,
  masterFingerprint,
}) => {
  if (!isOpen) return null;

  const firstColumn = seedPhrase.slice(0, 6);
  const secondColumn = seedPhrase.slice(6, 12);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            Asegura tu frase de recuperación
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-[#F88612]" />
            </div>

            <div className="space-y-2">
              <p className="font-bold text-gray-900">
                La combinación de palabras que ves a continuación se llama frase
                de recuperación.
              </p>
              <p className="text-gray-700">
                La frase de recuperación te permite acceder y restaurar tu
                billetera. Escríbela en un papel o metal en el orden exacto:
              </p>
            </div>

            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">⚠️ ¿No ves tu transacción?</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl">
            <div className="space-y-2">
              {firstColumn.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                >
                  <span className="text-sm font-semibold text-gray-500 w-6">
                    {index + 1}.
                  </span>
                  <span className="font-mono font-medium text-gray-900">
                    {word}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {secondColumn.map((word, index) => (
                <div
                  key={index + 6}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                >
                  <span className="text-sm font-semibold text-gray-500 w-6">
                    {index + 7}.
                  </span>
                  <span className="font-mono font-medium text-gray-900">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {masterFingerprint && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Master Fingerprint:</p>
              <p className="font-mono font-semibold text-gray-900">
                {masterFingerprint}
              </p>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 leading-relaxed space-y-2">
            <p>
              La frase de recuperación es una copia de seguridad que te permite
              restaurar tu billetera en caso de que el servidor falle. Si la
              pierdes o la anotas de forma incorrecta, podrías perder
              permanentemente el acceso a tus fondos.
            </p>
            <p className="font-semibold">
              No la fotografíes. No la almacenes digitalmente.
            </p>
            <p>
              La frase de recuperación también se almacenará en el servidor como
              una hot wallet.
            </p>
          </div>

          <div className="bg-[#FFF9EC] border border-[#FFE0B2] rounded-xl p-6 space-y-3">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#A94D14]">
                <AlertTriangle className="w-6 h-6 text-[#A94D14]" />
              </div>
              <h3 className="font-bold text-[#F88612]">Consejo de seguridad</h3>
            </div>
            <p className="text-center text-sm text-gray-700 leading-relaxed">
              Dado que las hot wallet están más expuestas a riesgos, te
              recomendamos mantener solo montos bajos para operaciones diarias y
              transferir periódicamente los fondos a tu billetera fría para
              maximizar tu seguridad. Esto reduce el riesgo en caso de que tu
              servidor o dispositivo sea comprometido.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#F88612] text-white font-semibold rounded-xl hover:bg-[#E67300] transition-colors"
          >
            Hecho
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseModal;
