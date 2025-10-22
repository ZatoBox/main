'use client';

import React, { createContext, useContext, useState } from 'react';

interface CashSuccessContextType {
  showModal: (orderId?: string) => void;
  hideModal: () => void;
  isOpen: boolean;
  orderId?: string;
}

const CashSuccessContext = createContext<CashSuccessContextType | undefined>(
  undefined
);

export const CashSuccessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>();

  const showModal = (id?: string) => {
    setOrderId(id);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <CashSuccessContext.Provider
      value={{ showModal, hideModal, isOpen, orderId }}
    >
      {children}
    </CashSuccessContext.Provider>
  );
};

export const useCashSuccess = () => {
  const context = useContext(CashSuccessContext);
  if (!context) {
    throw new Error('useCashSuccess must be used within CashSuccessProvider');
  }
  return context;
};
