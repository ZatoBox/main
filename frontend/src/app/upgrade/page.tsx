import React from 'react';
import { PricingSectionCompact } from '@/components/landing/pricing-section-compact';

export default function UpgradePage() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='flex justify-center mt-0'>
        <div className='w-full max-w-6xl'>
          <PricingSectionCompact />
        </div>
      </div>
    </div>
  );
}
