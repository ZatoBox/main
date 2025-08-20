import { useState, useCallback, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('zatobox-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zatobox-cart', JSON.stringify(cart));
  }, [cart]);

  // Calculate totals
  const calculateTotals = useCallback((items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
  }, []);

  // Add item to cart
  const addItem = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.id === product.id);
      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevCart.items, { ...product, quantity }];
      }

      const { total, itemCount } = calculateTotals(newItems);
      return { items: newItems, total, itemCount };
    });
  }, [calculateTotals]);

  // Remove item from cart
  const removeItem = useCallback((productId: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== productId);
      const { total, itemCount } = calculateTotals(newItems);
      return { items: newItems, total, itemCount };
    });
  }, [calculateTotals]);

  // Update item quantity
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      const { total, itemCount } = calculateTotals(newItems);
      return { items: newItems, total, itemCount };
    });
  }, [calculateTotals, removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  }, []);

  // Get item quantity
  const getItemQuantity = useCallback((productId: number) => {
    const item = cart.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cart.items]);

  // Check if item is in cart
  const isItemInCart = useCallback((productId: number) => {
    return cart.items.some(item => item.id === productId);
  }, [cart.items]);

  // Get cart summary for checkout
  const getCheckoutSummary = useCallback(() => {
    const subtotal = cart.total;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      itemCount: cart.itemCount,
      items: cart.items,
    };
  }, [cart]);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
    getCheckoutSummary,
  };
};

export default useCart;
