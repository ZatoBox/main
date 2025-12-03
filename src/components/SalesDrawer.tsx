'use client';

import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { checkoutCashOrder } from '@/services/cash-payments.service';
import { useCashSuccess } from '@/context/cash-success-context';

type PaymentMethod = 'cash' | 'crypto';

interface SalesItem {
  id: string | number;
  polarProductId: string;
  name: string;
  quantity: number;
  price: number;
  priceId: string;
  stock: number;
  recurring_interval?: string | null;
  productData: any;
}

interface SalesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPayment: (total: number, paymentMethod: PaymentMethod) => void;
  cartItems: SalesItem[];
  updateCartItemQuantity: (id: string | number, change: number) => void;
  removeCartItem: (id: string | number) => void;
  clearCart: () => void;
  onPaymentSuccess?: () => void;
}

const SalesDrawer: React.FC<SalesDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToPayment,
  cartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  onPaymentSuccess,
}) => {
  const { showModal } = useCashSuccess();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    return sum + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0);
  const cartAmount = subtotal;

  const handlePaymentClick = async () => {
    const validCartAmount = isNaN(cartAmount) ? 0 : cartAmount;

    if (paymentMethod === 'cash') {
      setIsProcessing(true);
      setMessage(null);

      try {
        const items = cartItems.map((item) => ({
          productId: item.polarProductId,
          quantity: item.quantity,
          price: item.price,
        }));

        const response = await checkoutCashOrder({ items });

        if (response.success) {
          clearCart();
          showModal(response.order?.id);
          onClose();
          onPaymentSuccess?.();
        } else {
          setMessage({
            type: 'error',
            text: response.message || 'Error al procesar el pago',
          });
        }
      } catch (error: any) {
        setMessage({
          type: 'error',
          text: error.message || 'Error al procesar el pago',
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      onNavigateToPayment(validCartAmount, paymentMethod);
    }
  };

  return (
    <>
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white border-l border-[#CBD5E1] transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#CBD5E1] bg-[#F9FAFB]">
          <h2 className="text-lg font-semibold text-black animate-slide-in-left">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-all duration-300 rounded-full hover:bg-gray-50 hover:scale-110 icon-bounce"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {cartItems.length > 0 ? (
            <div className="space-y-4 animate-stagger">
              {cartItems.map((item, index) => (
                <div
                  key={`cart-item-${index}-${item.id || 'unknown'}`}
                  className="p-4 bg-white border rounded-lg shadow-sm border-[#CBD5E1] hover-lift"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-black text-glow">
                        {item.name}
                      </h3>
                      {item.recurring_interval && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {item.recurring_interval}ly
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="transition-colors duration-300 text-error hover:text-error-600 icon-bounce"
                    >
                      <Trash2 size={16} color="red" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartItemQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="flex items-center justify-center w-8 h-8 transition-all duration-300 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 font-medium text-center text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(item.id, 1)}
                        disabled={
                          item.quantity >=
                          (item.productData?.metadata?.quantity || item.stock)
                        }
                        className="flex items-center justify-center w-8 h-8 transition-all duration-300 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </div>
                      <div className="text-xs text-gray-400">
                        Stock:{' '}
                        {item.productData?.metadata?.quantity || item.stock}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center animate-fade-in">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-black">
                Your cart is empty
              </h3>
              <p className="text-gray-500">Add some products to get started</p>
            </div>
          )}

          {/* Summary */}
          {cartItems.length > 0 && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <div className="p-4 border rounded-lg bg-gray-50 border-[#CBD5E1]">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#CBD5E1]">Subtotal:</span>
                    <span className="text-black">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between pt-2 text-lg font-bold border-t border-[#CBD5E1]">
                    <span className="text-black">Total:</span>
                    <span className="text-success">
                      ${cartAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-black">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    disabled={isProcessing}
                    className={`py-3 px-4 font-medium transition-all duration-300 rounded-lg border-2 disabled:opacity-50 ${
                      paymentMethod === 'cash'
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod('crypto')}
                    disabled={isProcessing}
                    className={`py-3 px-4 font-medium transition-all duration-300 rounded-lg border-2 disabled:opacity-50 ${
                      paymentMethod === 'crypto'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Bitcoin
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium text-center transition-all ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                onClick={handlePaymentClick}
                disabled={isProcessing}
                className="w-full py-4 font-medium text-white transition-all duration-300 bg-[#F88612] hover:bg-[#d17110] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === 'cash' ? (
                  'Create Cash Order'
                ) : (
                  'Pay with Bitcoin'
                )}
              </button>

              <button
                onClick={clearCart}
                className="w-full py-3 font-medium transition-all duration-300 bg-gray-100 rounded-lg hover:bg-gray-200 text-black"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SalesDrawer;
