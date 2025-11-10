'use client';

import React, { createContext, useContext, useState } from 'react';

interface CryptoSuccessContextType {
  showModal: (
    orderId?: string,
    invoiceId?: string,
    isPending?: boolean
  ) => void;
  hideModal: () => void;
  isOpen: boolean;
  orderId?: string;
  invoiceId?: string;
  isPending: boolean;
  refreshStock: () => void;
}

const CryptoSuccessContext = createContext<
  CryptoSuccessContextType | undefined
>(undefined);

export const CryptoSuccessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>();
  const [invoiceId, setInvoiceId] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [stockRefreshTrigger, setStockRefreshTrigger] = useState(0);

  const showModal = (id?: string, invId?: string, pending?: boolean) => {
    setOrderId(id);
    setInvoiceId(invId);
    setIsPending(pending ?? false);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const refreshStock = () => {
    setStockRefreshTrigger((prev) => prev + 1);
  };

  return (
    <CryptoSuccessContext.Provider
      value={{
        showModal,
        hideModal,
        isOpen,
        orderId,
        invoiceId,
        isPending,
        refreshStock,
      }}
    >
      {children}
    </CryptoSuccessContext.Provider>
  );
};

export const useCryptoSuccess = () => {
  const context = useContext(CryptoSuccessContext);
  if (!context) {
    throw new Error(
      'useCryptoSuccess must be used within CryptoSuccessProvider'
    );
  }
  return context;
};
