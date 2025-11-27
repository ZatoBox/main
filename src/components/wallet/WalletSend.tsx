'use client';

import React, { useState } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Clock,
  Turtle,
} from 'lucide-react';
import TransactionHelpModal from './TransactionHelpModal';

interface WalletSendProps {
  token: string;
  onSuccess?: () => void;
}

const WalletSend: React.FC<WalletSendProps> = ({ token, onSuccess }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [subtractFees, setSubtractFees] = useState(false);
  const [feeRate, setFeeRate] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0.00000000');
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await btcpayAPI.getWalletOverview(token);
        if (res.success && res.overview) {
          const rawBalance = res.overview.balance;
          const numericBalance = parseFloat(rawBalance);
          const formattedBalance = !isNaN(numericBalance)
            ? numericBalance.toFixed(8)
            : '0.00000000';
          setBalance(formattedBalance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessTx(null);

    try {
      const result = await btcpayAPI.sendFunds(token, {
        destination,
        amount: amount || undefined,
        feeRate,
        subtractFromAmount: subtractFees,
      });

      if (result.success && result.transaction) {
        setSuccessTx(result.transaction.transactionHash);
        setDestination('');
        setAmount('');
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || 'Error al enviar fondos');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="border-b border-[#E2E8F0] px-8 py-5 flex items-center justify-between bg-[#F8FAFC]">
        <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
          Enviar Fondos
        </h2>
        <div className="flex items-center gap-2 text-sm text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
          <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
          Wallet Activa
        </div>
      </div>

      <div className="p-8">
        {successTx && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-green-800 font-bold text-lg">
                ¡Transacción enviada con éxito!
              </h3>
              <p className="text-green-700 text-sm mt-1">
                Tu transacción ha sido transmitida a la red.
              </p>
              <div className="mt-2 p-2 bg-white/50 rounded border border-green-200 font-mono text-xs text-green-800 break-all">
                {successTx}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="relative w-full md:w-1/2 h-32 rounded-2xl overflow-hidden shadow-sm">
              <img
                src="/images/balance-background.svg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 h-full flex flex-col justify-center px-8 text-white">
                <span className="text-sm font-medium opacity-90">
                  Balance Total
                </span>
                <span className="text-3xl font-bold mt-1 tracking-tight">
                  {balance} BTC
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1E293B]">
                Dirección de Destino
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="bc1q..."
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#F88612]/20 focus:border-[#F88612] outline-none transition-all font-mono text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#1E293B]">
                Monto a Enviar
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.00000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00000000"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#F88612]/20 focus:border-[#F88612] outline-none transition-all font-mono text-lg"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#E2E8F0] rounded text-xs font-bold text-[#475569]">
                  BTC
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
                  <span>Dejar vacío para enviar el máximo disponible</span>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-[#F88612] transition-colors">
                    <input
                      type="checkbox"
                      checked={subtractFees}
                      onChange={(e) => setSubtractFees(e.target.checked)}
                      className="rounded border-gray-300 text-[#F88612] focus:ring-[#F88612]"
                    />
                    Restar comisión del monto
                  </label>
                </div>
                <div className="px-1">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs text-[#64748B] hover:text-[#F88612] transition-colors underline"
                  >
                    ¿No ves tu transacción?
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-[#F8FAFC] rounded-xl p-6 border border-[#E2E8F0] h-fit">
            <h3 className="text-sm font-semibold text-[#1E293B] mb-4">
              Prioridad de Red
            </h3>

            <div className="space-y-3 mb-8">
              <button
                type="button"
                onClick={() => setFeeRate(1)}
                className={`w-full p-3 flex items-center justify-between rounded-lg border transition-all ${
                  feeRate === 1
                    ? 'bg-white border-[#F88612] shadow-sm ring-1 ring-[#F88612]'
                    : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      feeRate === 1
                        ? 'bg-[#FFF4E5] text-[#F88612]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    <Turtle size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[#1E293B]">
                      Económica
                    </div>
                    <div className="text-xs text-[#64748B]">~10-60 min</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#64748B]">1 sat/vB</div>
              </button>

              <button
                type="button"
                onClick={() => setFeeRate(5)}
                className={`w-full p-3 flex items-center justify-between rounded-lg border transition-all ${
                  feeRate === 5
                    ? 'bg-white border-[#F88612] shadow-sm ring-1 ring-[#F88612]'
                    : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      feeRate === 5
                        ? 'bg-[#FFF4E5] text-[#F88612]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    <Clock size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[#1E293B]">
                      Estándar
                    </div>
                    <div className="text-xs text-[#64748B]">~10-30 min</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#64748B]">5 sat/vB</div>
              </button>

              <button
                type="button"
                onClick={() => setFeeRate(10)}
                className={`w-full p-3 flex items-center justify-between rounded-lg border transition-all ${
                  feeRate === 10
                    ? 'bg-white border-[#F88612] shadow-sm ring-1 ring-[#F88612]'
                    : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      feeRate === 10
                        ? 'bg-[#FFF4E5] text-[#F88612]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    <Zap size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-[#1E293B]">
                      Rápida
                    </div>
                    <div className="text-xs text-[#64748B]">~10 min</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#64748B]">
                  10 sat/vB
                </div>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !destination}
              className="w-full py-4 bg-[#F88612] text-white font-bold rounded-xl hover:bg-[#E67300] transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Envío</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <TransactionHelpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default WalletSend;
