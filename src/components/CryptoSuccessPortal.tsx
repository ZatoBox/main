'use client';

import React from 'react';
import CryptoSuccessModal from '@/components/CryptoSuccessModal';
import { useCryptoSuccess } from '@/context/crypto-success-context';

const CryptoSuccessPortal: React.FC = () => {
  const { isOpen, hideModal, orderId, invoiceId, isPending } =
    useCryptoSuccess();

  return (
    <CryptoSuccessModal
      isOpen={isOpen}
      orderId={orderId}
      invoiceId={invoiceId}
      isPending={isPending}
      onClose={hideModal}
    />
  );
};

export default CryptoSuccessPortal;
