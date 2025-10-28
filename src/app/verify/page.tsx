'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  verifyCode,
  sendVerification,
} from '@/services/email-verification.service';

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const userIdParam = params?.get('userId') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState(userIdParam);

  useEffect(() => {
    if (!userId && userIdParam) setUserId(userIdParam);
  }, [userIdParam, userId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!userId) return setMessage('User missing');
    setLoading(true);
    setMessage(null);
    const res = await verifyCode({ userId, code });
    setLoading(false);
    if (res.success) {
      router.push('/login');
    } else {
      setMessage(res.message || 'Código inválido');
    }
  };

  const handleResend = async () => {
    if (!userId) return setMessage('User missing');
    setLoading(true);
    setMessage(null);
    const res = await sendVerification({ userId });
    setLoading(false);
    if (res.success) setMessage('Código reenviado');
    else setMessage(res.message || 'Error al reenviar');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Verificar correo
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Ingresa el código de 6 dígitos que te enviamos por correo.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            aria-label="verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center text-xl tracking-widest border rounded h-12"
            placeholder="000000"
            maxLength={6}
          />
          {message && <div className="text-sm text-red-600">{message}</div>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-zatobox-500 text-white rounded"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="flex-1 h-11 border rounded"
            >
              {loading ? 'Enviando...' : 'Reenviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
