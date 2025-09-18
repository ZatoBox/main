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
    id: string;
    name: string;
    price: number;
    stock: number;
    quantity: number;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Use local search term (takes priority over external)
  const activeSearchTerm = localSearchTerm || externalSearchTerm;

  const mapPolarProductToProduct = (p: any): Product => {
    const prices = Array.isArray(p.prices) ? p.prices : [];
    let price = 0;
    if (prices.length > 0) {
      const pr = prices[0] || {};
      const amt = pr.price_amount ?? pr.priceAmount;
      const amtType = pr.amount_type ?? pr.amountType;
      if (typeof amt === 'number') {
        price = amtType === 'free' ? 0 : amt / 100;
      }
    }
    const imageUrls = Array.isArray(p.medias)
      ? p.medias
          .filter(
            (m: any) =>
              m &&
              typeof m.public_url === 'string' &&
              m.mime_type &&
              m.mime_type.startsWith('image/')
          )
          .map((m: any) => m.public_url)
      : [];
    return {
      id: String(p.id),
      name: p.name || 'Unnamed Product',
      description: p.description || '',
      price,
      stock: p.metadata?.quantity || 0,
      min_stock: 0,
      category_ids: [],
      images: imageUrls,
      status: 'active' as any,
      weight: 0,
      sku: String(p.id),
      creator_id: '',
      unit: 'Per item' as any,
      product_type: 'Physical Product' as any,
      localization: '',
      created_at: p.created_at || p.createdAt || new Date().toISOString(),
      last_updated:
        p.modified_at ||
        p.modifiedAt ||
        p.updatedAt ||
        new Date().toISOString(),
    } as Product;
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getActiveProducts();
        if (response && response.success && Array.isArray(response.products)) {
          const rows: any[] = response.products;
          const filtered = rows.filter(
            (p: any) => !(p.is_archived ?? p.is_archived)
          );
          const availableProducts = filtered.map(mapPolarProductToProduct);
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
  }, []);

  const enrichedProducts = useMemo(() => {
    return products;
  }, [products]);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!activeSearchTerm.trim()) {
      return enrichedProducts;
    }

    return enrichedProducts.filter((product: any) =>
      product.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
    );
  }, [activeSearchTerm, enrichedProducts]);

  // When clicking on a product, add it to cart
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
    setCartItems((prevCart) => {
      const pid = String(product.id);
      const existing = prevCart.find((item) => item.id === pid);
      if (existing) {
        // Add quantity, respecting stock
        return prevCart.map((item) =>
          item.id === pid
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: pid,
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
      const saleData: any = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: paymentTotal,
        payment_method: method,
      };

      // Send sale to backend
      const saleResponse: any = await salesAPI.create(saleData);

      if (saleResponse && saleResponse.success) {
        console.log('Sale created successfully:', saleResponse);

        // Update local inventory immediately
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            const pid = String(product.id);
            const cartItem = cartItems.find((item) => item.id === pid);
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
  const updateCartItemQuantity = (
    productId: number | string,
    change: number
  ) => {
    setCartItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === String(productId)
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      );
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: number | string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== String(productId))
    );
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
        const rows: any[] = response.products;
        const filtered = rows.filter(
          (p: any) => !(p.is_archived ?? p.is_archived)
        );
        const availableProducts = filtered.map(mapPolarProductToProduct);
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
        cartItems={cartItems.map((ci) => ({ ...ci, id: Number(ci.id) })) as any}
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
        items={cartItems.map((ci) => ({ ...ci, id: Number(ci.id) })) as any}
      />
    </>
  );
};

export default HomePage;
