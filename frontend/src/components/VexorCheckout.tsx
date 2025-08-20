import React, { useState } from 'react';
import { VexorPayService, PaymentRequest, PaymentResponse } from '../services/vexorpay';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutProps {
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  onPaymentSuccess?: (payment: PaymentResponse) => void;
  onPaymentError?: (error: string) => void;
  onCancel?: () => void;
}

const VexorCheckout: React.FC<CheckoutProps> = ({
  items,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate payment data
      const paymentData: PaymentRequest = {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'USD',
        description: `ZatoBox Sale - ${items.length} items`,
        customer: {
          email: user?.email || '',
          name: user?.full_name || 'Customer',
          phone: user?.phone || undefined,
        },
        metadata: {
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          tax,
          total,
          timestamp: new Date().toISOString(),
        },
      };

      VexorPayService.validatePaymentData(paymentData);

      // Create payment
      const payment = await VexorPayService.createPayment(paymentData);

      if (payment.paymentUrl) {
        setPaymentUrl(payment.paymentUrl);
        // Open payment URL in new tab/window
        window.open(payment.paymentUrl, '_blank');
        
        // Call success callback
        if (onPaymentSuccess) {
          onPaymentSuccess(payment);
        }
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPaymentUrl(null);
    setError(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>
      
      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-gray-600">
                {item.name} x {item.quantity}
              </span>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        
        <hr className="my-3" />
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      {user && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Customer</h3>
          <p className="text-gray-600">{user.full_name}</p>
          <p className="text-gray-600">{user.email}</p>
          {user.phone && <p className="text-gray-600">{user.phone}</p>}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Payment URL */}
      {paymentUrl && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-medium">Payment link created!</p>
          <p className="text-sm">
            <a 
              href={paymentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Click here to complete payment
            </a>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handlePayment}
          disabled={loading || items.length === 0}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            loading || items.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </button>
        
        <button
          onClick={handleCancel}
          className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* VexorPay Branding */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Powered by <span className="font-medium">VexorPay</span>
        </p>
      </div>
    </div>
  );
};

export default VexorCheckout;
