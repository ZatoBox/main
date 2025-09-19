'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const SuccessContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('checkout_id');
    setCheckoutId(id);
  }, [searchParams]);

  return (
    <div className='min-h-screen bg-bg-main flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center'>
        <div className='mb-6'>
          <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Payment Successful!
          </h1>
          <p className='text-gray-600'>
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {checkoutId && (
          <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <p className='text-sm text-gray-500 mb-1'>Order ID:</p>
            <p className='text-sm font-mono text-gray-900 break-all'>
              {checkoutId}
            </p>
          </div>
        )}

        <div className='space-y-3'>
          <button
            onClick={() => router.push('/home')}
            className='w-full bg-[#F88612] hover:bg-[#D9740F] text-white font-semibold py-3 px-6 rounded-lg transition-colors'
          >
            Continue Shopping
          </button>

          <button
            onClick={() => router.push('/inventory')}
            className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>View Inventory</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-bg-main flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center'>
            <div className='mb-6'>
              <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse'></div>
              <div className='h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded mx-auto animate-pulse'></div>
            </div>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
