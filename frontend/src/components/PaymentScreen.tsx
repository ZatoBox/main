import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Bitcoin, Banknote, Calculator } from 'lucide-react';

interface PaymentScreenProps {
  isOpen: boolean;
  onBack: () => void;
  onPaymentSuccess: (method: string) => void;
  total: number;
}

type PaymentMethod = 'card' | 'wallet' | 'crypto' | 'cash';

const PaymentScreen: React.FC<PaymentScreenProps> = ({ isOpen, onBack, onPaymentSuccess, total }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardName: '',
    cryptoCurrency: 'bitcoin',
    walletAddress: '',
    cashAmount: total.toString(),
    needsChange: false,
    changeFor: ''
  });

  // States for change calculation
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);
  const [isSufficientAmount, setIsSufficientAmount] = useState<boolean>(false);

  // Calculate change automatically when received amount changes
  useEffect(() => {
    const received = parseFloat(cashReceived.toString()) || 0;
    const change = received - total;
    setChangeAmount(change);
    setIsSufficientAmount(received >= total);
  }, [cashReceived, total]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCashReceivedChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setCashReceived(amount);
  };

  const isFormValid = () => {
    switch (selectedMethod) {
      case 'card':
        return formData.cardNumber && formData.expiryDate && formData.cvc && formData.cardName;
      case 'wallet':
        return true; // Wallet payments are handled externally
      case 'crypto':
        return formData.walletAddress;
      case 'cash':
        return cashReceived >= total; // Must receive at least the total
      default:
        return false;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod | null) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'wallet':
        return 'Apple Pay / Google Pay';
      case 'crypto':
        return 'Coinbase Pay / Crypto';
      case 'cash':
        return 'Cash on Delivery';
      default:
        return 'Payment method';
    }
  };

  const handleConfirmPayment = () => {
    if (isFormValid() && selectedMethod) {
      onPaymentSuccess(getPaymentMethodName(selectedMethod));
    }
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-bg-main z-50 flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-divider bg-bg-surface">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-50 rounded-full transition-all duration-300 hover:scale-110 icon-bounce"
        >
          <ArrowLeft size={20} className="text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary animate-slide-in-left">Payment Options</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Total Amount */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-divider animate-bounce-in">
          <div className="text-center">
            <span className="text-sm text-text-secondary">Total to pay</span>
            <div className="text-2xl font-bold text-text-primary">{formatCurrency(total)}</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-6 animate-stagger">
          {/* Credit/Debit Card */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover-lift ${
              selectedMethod === 'card' ? 'border-complement bg-complement-50 shadow-lg' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('card')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                selectedMethod === 'card' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5 animate-scale-in"></div>}
              </div>
              <CreditCard size={20} className="text-text-secondary icon-bounce" />
              <div>
                <div className="font-medium text-text-primary text-glow">Credit/Debit Card</div>
                <div className="text-sm text-text-secondary">Visa, Mastercard, American Express</div>
              </div>
            </div>
          </div>

          {/* Apple Pay / Google Pay */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover-lift ${
              selectedMethod === 'wallet' ? 'border-complement bg-complement-50 shadow-lg' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('wallet')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                selectedMethod === 'wallet' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'wallet' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5 animate-scale-in"></div>}
              </div>
              <Smartphone size={20} className="text-text-secondary icon-bounce" />
              <div>
                <div className="font-medium text-text-primary text-glow">Apple Pay / Google Pay</div>
                <div className="text-sm text-text-secondary">Quick payment with your wallet</div>
              </div>
            </div>
          </div>

          {/* Crypto */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover-lift ${
              selectedMethod === 'crypto' ? 'border-complement bg-complement-50 shadow-lg' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('crypto')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                selectedMethod === 'crypto' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'crypto' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5 animate-scale-in"></div>}
              </div>
              <Bitcoin size={20} className="text-text-secondary icon-bounce" />
              <div>
                <div className="font-medium text-text-primary text-glow">Coinbase Pay / Crypto</div>
                <div className="text-sm text-text-secondary">Bitcoin, Ethereum, and more</div>
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover-lift ${
              selectedMethod === 'cash' ? 'border-complement bg-complement-50 shadow-lg' : 'border-divider hover:border-gray-300 bg-bg-surface'
            }`}
            onClick={() => setSelectedMethod('cash')}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                selectedMethod === 'cash' ? 'border-complement bg-complement' : 'border-gray-300'
              }`}>
                {selectedMethod === 'cash' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5 animate-scale-in"></div>}
              </div>
              <Banknote size={20} className="text-text-secondary icon-bounce" />
              <div>
                <div className="font-medium text-text-primary text-glow">Cash on Delivery</div>
                <div className="text-sm text-text-secondary">Pay with cash upon delivery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Forms */}
        {selectedMethod && (
          <div className="bg-bg-surface border border-divider rounded-lg p-6 mb-6 animate-fade-in">
            {selectedMethod === 'card' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Card Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Card Number</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">CVC</label>
                    <input
                      type="text"
                      value={formData.cvc}
                      onChange={(e) => handleInputChange('cvc', e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'crypto' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Crypto Payment</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Cryptocurrency</label>
                  <select
                    value={formData.cryptoCurrency}
                    onChange={(e) => handleInputChange('cryptoCurrency', e.target.value)}
                    className="w-full px-4 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent"
                  >
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="litecoin">Litecoin (LTC)</option>
                    <option value="cardano">Cardano (ADA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    placeholder="Enter your wallet address"
                    className="w-full px-4 py-3 border border-divider rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'cash' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Cash Payment</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Amount Received</label>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => handleCashReceivedChange(e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-complement focus:border-transparent ${
                      isSufficientAmount ? 'border-green-500' : 'border-divider'
                    }`}
                    min={total}
                    step="0.01"
                  />
                  {!isSufficientAmount && cashReceived > 0 && (
                    <p className="text-red-500 text-sm mt-1">Insufficient amount. Please enter at least {formatCurrency(total)}</p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Quick Amount</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 20, 50, 100, 200, 500].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleCashReceivedChange(amount.toString())}
                        className="px-3 py-2 border border-divider rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Change Calculator */}
                {cashReceived > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">Change to return:</span>
                      <span className={`text-lg font-bold ${changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(changeAmount))}
                      </span>
                    </div>
                    {changeAmount < 0 && (
                      <p className="text-red-500 text-sm">Additional amount needed: {formatCurrency(Math.abs(changeAmount))}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedMethod === 'wallet' && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Mobile Payment</h3>
                <p className="text-text-secondary">Use your mobile wallet to complete the payment</p>
              </div>
            )}
          </div>
        )}

        {/* Confirm Payment Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={!isFormValid()}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
            isFormValid()
              ? 'bg-complement hover:bg-complement-700 text-white shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedMethod === 'cash' 
            ? `Confirm Payment - ${formatCurrency(total)}`
            : 'Confirm Payment'
          }
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;