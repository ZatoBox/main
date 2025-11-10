'use client';

import { CryptoCheckout } from '@/components/checkout/CryptoCheckout';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Completa tu compra con criptomonedas</p>
        </div>
        <CryptoCheckout />
      </div>
    </div>
  );
}
