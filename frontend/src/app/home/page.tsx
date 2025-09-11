'use client';

import React, { useState, useMemo, useEffect } from 'react';
import HomeHeader from '@/components/home/HomeHeader';
import ProductGrid from '@/components/home/ProductGrid';
import HomeStats from '@/components/home/HomeStats';
import SalesDrawer from '@/components/SalesDrawer';
import PaymentScreen from '@/components/PaymentScreen';
import PaymentSuccessScreen from '@/components/PaymentSuccessScreen';
import { getActiveProducts, salesAPI } from '@/services/api.service';
import type { Product } from '@/types/index';
import { useAuth } from '@/context/auth-store';

interface HomePageProps {
  tab?: string;
  searchTerm?: string;
}

const HomePage: React.FC<HomePageProps> = ({
  searchTerm: externalSearchTerm = '',
}) => {
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Shopping cart
  interface CartItem {
    id: number;
    name: string;
    price: number;
    stock: number;
    quantity: number;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Use local search term (takes priority over external)
  const activeSearchTerm = localSearchTerm || externalSearchTerm;

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getActiveProducts();
        if (response && response.success && Array.isArray(response.products)) {
          const availableProducts = response.products.map((product: any) => {
            return {
              ...product,
              stock: Number(product.stock ?? 0),
            } as Product;
          });
          setProducts(availableProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated]);

  // Update products when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        reloadProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!activeSearchTerm.trim()) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
    );
  }, [activeSearchTerm, products]);

  // When clicking on a product, add it to cart
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        // Add quantity, respecting stock
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            quantity: 1,
          },
        ];
      }
    });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleNavigateToPayment = (total: number) => {
    setPaymentTotal(total);
    setIsPaymentOpen(true);
  };

  const handleBackFromPayment = () => {
    setIsPaymentOpen(false);
  };

  const handlePaymentSuccess = async (method: string) => {
    try {
      // Prepare sale data
      const saleData = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: paymentTotal,
        paymentMethod: method,
      };

      // Send sale to backend
      const saleResponse = await salesAPI.create(saleData);

      if (saleResponse.success) {
        console.log('Sale created successfully:', saleResponse);

        // Update local inventory immediately
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id);
            if (cartItem) {
              return {
                ...product,
                stock: Math.max(0, product.stock - cartItem.quantity),
              };
            }
            return product;
          })
        );

        // Show success message
        setPaymentMethod(method);
        setIsPaymentOpen(false);
        setIsSuccessOpen(true);
      } else {
        console.error('Error creating sale:', saleResponse);
        alert('Error processing sale. Please try again.');
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale. Please try again.');
    }
  };

  const handleNewOrder = () => {
    // Reset all states to start fresh
    setIsSuccessOpen(false);
    setIsDrawerOpen(false);
    setIsPaymentOpen(false);
    setSelectedProduct(null);
    setPaymentTotal(0);
    setPaymentMethod('');
    // Reset cart items to initial state
    setCartItems([]);
  };

  const handleLocalSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  // Modify quantity of a product in cart
  const updateCartItemQuantity = (productId: number, change: number) => {
    setCartItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      );
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Function to reload products
  const reloadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActiveProducts();

      if (response && response.success && Array.isArray(response.products)) {
        const availableProducts = response.products.map((product: any) => {
          return {
            ...product,
            stock: Number(product.stock ?? 0),
          } as Product;
        });
        setProducts(availableProducts);
      } else {
        setProducts([]);
        setError('Error reloading products');
      }
    } catch (err) {
      console.error('Error reloading products:', err);
      setProducts([]);
      setError('Error reloading products');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen pt-16 bg-bg-main animate-fade-in'>
        <div className='text-center'>
          <div className='w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary animate-pulse-glow'></div>
          <p className='text-text-secondary animate-slide-in-left'>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen pt-16 bg-bg-main animate-fade-in'>
        <div className='text-center'>
          <div className='mb-4 text-red-500 animate-bounce-in'>
            <svg
              className='w-12 h-12 mx-auto'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <p className='mb-4 text-text-primary animate-slide-in-left'>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 font-medium text-black transition-all duration-300 rounded-lg bg-primary hover:bg-primary-600 hover:scale-105 hover:shadow-lg btn-animate'
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`py-8 transition-all duration-300 ${
          isDrawerOpen && !isPaymentOpen && !isSuccessOpen
            ? 'md:mr-[40%] lg:mr-[33.333333%]'
            : ''
        }`}
      >
        <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='mb-6'>
            <HomeHeader
              searchValue={localSearchTerm}
              onSearchChange={handleLocalSearchChange}
              onReload={reloadProducts}
              loading={loading}
            />
            <HomeStats
              count={filteredProducts.length}
              searchTerm={activeSearchTerm}
            />
          </div>

          {/* Responsive Grid with white background */}
          <div className='p-6 bg-white border rounded-lg border-gray-300 animate-scale-in'>
            <ProductGrid
              products={filteredProducts}
              onProductClick={handleProductClick}
            />
          </div>
        </div>
      </div>

      <SalesDrawer
        isOpen={isDrawerOpen && !isPaymentOpen && !isSuccessOpen}
        onClose={handleCloseDrawer}
        onNavigateToPayment={handleNavigateToPayment}
        cartItems={cartItems}
        updateCartItemQuantity={updateCartItemQuantity}
        removeCartItem={removeFromCart}
        clearCart={clearCart}
      />

      <PaymentScreen
        isOpen={isPaymentOpen}
        onBack={handleBackFromPayment}
        onPaymentSuccess={handlePaymentSuccess}
        cartAmount={paymentTotal}
      />

      <PaymentSuccessScreen
        isOpen={isSuccessOpen}
        onNewOrder={handleNewOrder}
        paymentMethod={paymentMethod}
        total={paymentTotal}
        items={cartItems}
      />
    </>
  );
};

export default HomePage;
