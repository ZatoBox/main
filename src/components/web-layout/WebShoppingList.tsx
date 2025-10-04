import React, { useState } from 'react';
import SalesDrawer from '@/components/SalesDrawer';

const WebShoppingList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems: any[] = [];
  const onClose = () => setIsOpen(false);
  const onNavigateToPayment = (
    _total: number,
    _paymentMethod: 'cash' | 'zatoconnect'
  ) => {};
  const updateCartItemQuantity = (_id: string | number, _change: number) => {};
  const removeCartItem = (_id: string | number) => {};
  const clearCart = () => {};

  return (
    <SalesDrawer
      isOpen={isOpen}
      onClose={onClose}
      onNavigateToPayment={onNavigateToPayment}
      cartItems={cartItems}
      updateCartItemQuantity={updateCartItemQuantity}
      removeCartItem={removeCartItem}
      clearCart={clearCart}
    />
  );
};

export default WebShoppingList;
