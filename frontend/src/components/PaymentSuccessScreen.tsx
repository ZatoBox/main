'use client';

import React, { useState, useEffect } from 'react';
import { Check, Download, Mail } from 'lucide-react';

interface PaymentSuccessScreenProps {
  isOpen: boolean;
  onNewOrder: () => void;
  paymentMethod: string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  isOpen,
  onNewOrder,
  paymentMethod,
  total,
  items,
}) => {
  const [email, setEmail] = useState('');
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animations
      setTimeout(() => setShowCheckmark(true), 200);
      setTimeout(() => setShowConfetti(true), 600);
    } else {
      setShowCheckmark(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * 0.15;
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleDateString('en-US');

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-zatobox-50 animate-scale-in'>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className='absolute w-2 h-2 bg-primary animate-bounce'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className='relative flex items-center justify-center p-4 border-b border-zatobox-200 bg-zatobox-50'>
        <h1 className='text-lg font-semibold text-zatobox-900 animate-slide-in-left'>
          Payment Successful
        </h1>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='max-w-6xl p-4 mx-auto lg:p-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            {/* Left Side - Success Banner */}
            <div className='flex flex-col items-center justify-center space-y-6 lg:pr-8 animate-stagger'>
              {/* Animated Checkmark */}
              <div
                className={`relative transition-all duration-500 ${
                  showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
              >
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-success animate-pulse-glow'>
                  <Check size={48} className='text-white animate-bounce-in' />
                </div>
                <div className='absolute inset-0 w-24 h-24 rounded-full bg-success animate-ping opacity-20'></div>
              </div>

              {/* Success Message */}
              <div className='space-y-2 text-center'>
                <h2 className='text-2xl font-bold text-zatobox-900 animate-slide-in-left'>
                  Payment Confirmed!
                </h2>
                <p className='text-zatobox-700 animate-slide-in-right'>
                  Your transaction has been processed successfully
                </p>
                <div className='p-3 border rounded-lg bg-gray-50 border-zatobox-200 animate-bounce-in'>
                  <span className='text-sm text-zatobox-700'>
                    Payment method:{' '}
                  </span>
                  <span className='font-medium text-zatobox-900'>
                    {paymentMethod}
                  </span>
                </div>
              </div>

              {/* Email Section */}
              <div className='w-full max-w-md space-y-4 animate-fade-in'>
                <h3 className='text-lg font-semibold text-center text-zatobox-900'>
                  Get your receipt
                </h3>
                <div className='flex space-x-2'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    className='flex-1 px-4 py-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent'
                  />
                  <button className='flex items-center px-6 py-3 text-white transition-colors rounded-lg bg-zatobox-500 hover:bg-zatobox-600'>
                    <Mail size={16} className='mr-2' />
                    Send
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col w-full max-w-md gap-3 sm:flex-row animate-fade-in'>
                <button
                  onClick={onNewOrder}
                  className='flex-1 px-6 py-3 font-medium text-black transition-colors rounded-lg bg-primary hover:bg-primary-600'
                >
                  New Order
                </button>
                <button className='flex items-center justify-center flex-1 px-6 py-3 font-medium transition-colors bg-gray-100 rounded-lg text-zatobox-900 hover:bg-gray-200'>
                  <Download size={16} className='mr-2' />
                  Download Receipt
                </button>
              </div>
            </div>

            {/* Right Side - Invoice Details */}
            <div className='p-6 border rounded-lg bg-zatobox-50 border-zatobox-200 animate-slide-in-right'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-zatobox-900'>Invoice</h3>
                <div className='text-right'>
                  <div className='text-sm text-zatobox-700'>Invoice #</div>
                  <div className='font-medium text-zatobox-900'>
                    {invoiceNumber}
                  </div>
                </div>
              </div>

              <div className='mb-6 space-y-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-zatobox-700'>Date:</span>
                  <span className='text-zatobox-900'>{currentDate}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-zatobox-700'>Payment Method:</span>
                  <span className='text-zatobox-900'>{paymentMethod}</span>
                </div>
              </div>

              {/* Items List */}
              <div className='pt-4 mb-6 border-t border-zatobox-200'>
                <h4 className='mb-3 font-semibold text-zatobox-900'>Items</h4>
                <div className='space-y-3'>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between'
                    >
                      <div className='flex-1'>
                        <div className='font-medium text-zatobox-900'>
                          {item.name}
                        </div>
                        <div className='text-sm text-zatobox-700'>
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium text-zatobox-900'>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className='text-sm text-zatobox-700'>
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className='pt-4 space-y-2 border-t border-zatobox-200'>
                <div className='flex justify-between text-sm'>
                  <span className='text-zatobox-700'>Subtotal:</span>
                  <span className='text-zatobox-900'>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-zatobox-700'>Tax (15%):</span>
                  <span className='text-zatobox-900'>${tax.toFixed(2)}</span>
                </div>
                <div className='flex justify-between pt-2 text-lg font-bold border-t border-zatobox-200'>
                  <span className='text-zatobox-900'>Total:</span>
                  <span className='text-success'>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Thank You Message */}
              <div className='p-4 mt-6 border border-green-200 rounded-lg bg-green-50'>
                <div className='text-center'>
                  <div className='mb-2 text-green-600'>🎉</div>
                  <h4 className='mb-1 font-semibold text-green-800'>
                    Thank you for your purchase!
                  </h4>
                  <p className='text-sm text-green-700'>
                    Your order has been processed successfully. You will receive
                    a confirmation email shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;
