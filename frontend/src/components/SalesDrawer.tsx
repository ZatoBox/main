import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface SalesItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  stock: number;
}

interface SalesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPayment: (total: number) => void;
  cartItems: SalesItem[];
  updateCartItemQuantity: (id: number, change: number) => void;
  removeCartItem: (id: number) => void;
  clearCart: () => void;
}

const SalesDrawer: React.FC<SalesDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToPayment,
  cartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
}) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    return sum + (isNaN(itemTotal) ? 0 : itemTotal);
  }, 0);
  // const tax = subtotal * 0.15; // 15% tax
  // const cartAmount = subtotal + tax;
  const cartAmount = subtotal;

  const handlePaymentClick = () => {
    const validCartAmount = isNaN(cartAmount) ? 0 : cartAmount;
    onNavigateToPayment(validCartAmount);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l border-[#CBD5E1] transform transition-transform duration-300 ease-in-out z-30 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-[#CBD5E1] bg-[#F9FAFB]'>
        <h2 className='text-lg font-semibold text-black animate-slide-in-left'>
          Shopping Cart
        </h2>
        <button
          onClick={onClose}
          className='p-2 transition-all duration-300 rounded-full hover:bg-gray-50 hover:scale-110 icon-bounce'
        >
          <X size={20} className='text-black' />
        </button>
      </div>

      {/* Content */}
      <div className='flex-1 p-4 overflow-y-auto'>
        {cartItems.length > 0 ? (
          <div className='space-y-4 animate-stagger'>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className='p-4 bg-white border rounded-lg shadow-sm border-[#CBD5E1] hover-lift'
              >
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='font-medium text-black text-glow'>
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeCartItem(item.id)}
                    className='transition-colors duration-300 text-error hover:text-error-600 icon-bounce'
                  >
                    <Trash2 size={16} color='red' />
                  </button>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => updateCartItemQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className='flex items-center justify-center w-8 h-8 transition-all duration-300 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110'
                    >
                      <Minus size={14} />
                    </button>
                    <span className='w-8 font-medium text-center text-black'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartItemQuantity(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                      className='flex items-center justify-center w-8 h-8 transition-all duration-300 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110'
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium text-black'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className='text-sm text-gray-500'>
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='py-12 text-center animate-fade-in'>
            <ShoppingCart size={48} className='mx-auto mb-4 text-gray-300' />
            <h3 className='mb-2 text-lg font-medium text-black'>
              Your cart is empty
            </h3>
            <p className='text-gray-500'>Add some products to get started</p>
          </div>
        )}

        {/* Summary */}
        {cartItems.length > 0 && (
          <div className='mt-6 space-y-4 animate-fade-in'>
            {/* Subtotal */}
            <div className='p-4 border rounded-lg bg-gray-50 border-[#CBD5E1]'>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-[#CBD5E1]'>Subtotal:</span>
                  <span className='text-black'>${subtotal.toFixed(2)}</span>
                </div>

                {/* 
                <div className='flex justify-between text-sm'>
                  <span className='text-[#CBD5E1]'>Tax (15%):</span>
                  <span className='text-black'>${tax.toFixed(2)}</span>
                </div>
                */}

                <div className='flex justify-between pt-2 text-lg font-bold border-t border-[#CBD5E1]'>
                  <span className='text-black'>Total:</span>
                  <span className='text-success'>${cartAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePaymentClick}
              className='w-full py-4 font-medium text-white transition-all duration-300 bg-[#F88612] hover:bg-[#d17110] rounded-lg'
            >
              Proceed to Payment
            </button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className='w-full py-3 font-medium transition-all duration-300 bg-gray-100 rounded-lg hover:bg-gray-200 text-black'
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDrawer;
