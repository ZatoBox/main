import React, { useState } from 'react';
import { btcpayAPI } from '@/services/btcpay.service';
import { Loader2, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface WalletSendFundsProps {
  token: string;
  onSuccess?: () => void;
}

const WalletSendFunds: React.FC<WalletSendFundsProps> = ({
  token,
  onSuccess,
}) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [subtractFees, setSubtractFees] = useState(false);
  const [feeRate, setFeeRate] = useState<number>(1); // Default 1 sat/vB
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);

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
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <Send className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Enviar Bitcoin</h3>
      </div>

      {successTx && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-green-800 font-medium">¡Transacción enviada!</p>
            <p className="text-green-700 text-sm break-all">
              Hash: {successTx}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección de destino
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="bc1q..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto (BTC)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
            <span className="absolute right-4 top-2 text-gray-500 text-sm">
              BTC
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Dejar vacío para enviar todo (Max)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="subtractFees"
            checked={subtractFees}
            onChange={(e) => setSubtractFees(e.target.checked)}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label
            htmlFor="subtractFees"
            className="text-sm text-gray-700 select-none"
          >
            Restar comisión del monto enviado
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Velocidad de confirmación (Fee Rate)
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFeeRate(1)}
              className={`p-3 border rounded-lg text-center transition-all ${
                feeRate === 1
                  ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500'
                  : 'border-gray-200 hover:border-orange-300 text-gray-600'
              }`}
            >
              <div className="text-sm font-medium">Lenta</div>
              <div className="text-xs opacity-75">~1 sat/vB</div>
            </button>
            <button
              type="button"
              onClick={() => setFeeRate(5)}
              className={`p-3 border rounded-lg text-center transition-all ${
                feeRate === 5
                  ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500'
                  : 'border-gray-200 hover:border-orange-300 text-gray-600'
              }`}
            >
              <div className="text-sm font-medium">Media</div>
              <div className="text-xs opacity-75">~5 sat/vB</div>
            </button>
            <button
              type="button"
              onClick={() => setFeeRate(10)}
              className={`p-3 border rounded-lg text-center transition-all ${
                feeRate === 10
                  ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500'
                  : 'border-gray-200 hover:border-orange-300 text-gray-600'
              }`}
            >
              <div className="text-sm font-medium">Rápida</div>
              <div className="text-xs opacity-75">~10 sat/vB</div>
            </button>
          </div>
          <div className="mt-2">
            <label className="text-xs text-gray-500">
              O ingresa manualmente (sat/vB):
            </label>
            <input
              type="number"
              min="1"
              value={feeRate}
              onChange={(e) => setFeeRate(Number(e.target.value))}
              className="mt-1 w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !destination}
          className="w-full py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Enviar Fondos</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default WalletSendFunds;
