'use client';

import React, { useState, useMemo, useEffect } from 'react';
import HomeHeader from '@/components/home/HomeHeader';
import ProductGrid from '@/components/home/ProductGrid';
import HomeStats from '@/components/home/HomeStats';
import SalesDrawer from '@/components/SalesDrawer';
import { getActiveProducts } from '@/services/api.service';
import type { Product } from '@/types/index';
import { useAuth } from '@/context/auth-store';
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from 'react-icons/io';

const mapProductToProduct = (p: any): Product => {
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
    id: String(p.id ?? ''),
    name: p.name || 'Unnamed Product',
    description: p.description || '',
    price: p.price || 0,
    stock: p.stock || 0,
    categories: p.categories || [],
    images: imageUrls,
    active: p.active !== false,
    sku: p.sku || String(p.id),
    creator_id: p.creator_id || '',
    created_at: p.created_at || new Date().toISOString(),
    updated_at: p.updated_at || new Date().toISOString(),
  };
};

interface HomePageProps {
  tab?: string;
  searchTerm?: string;
}

const HomePage: React.FC<HomePageProps> = ({
  searchTerm: externalSearchTerm = '',
}) => {
  const { user } = useAuth();
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

  // Carrito
  interface CartItem {
    id: string;
    polarProductId: string;
    name: string;
    price: number;
    priceId: string;
    stock: number;
    quantity: number;
    recurring_interval?: string | null;
    productData: any;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const activeSearchTerm = localSearchTerm || externalSearchTerm;

  // Cargar productos con paginación
  const reloadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * pageSize;
      const response = await getActiveProducts();

      if (response && response.success && Array.isArray(response.products)) {
        const rows: any[] = response.products;
        const filtered = rows.filter(
          (p: any) => !(p.is_archived ?? p.is_archived)
        );
        const availableProducts = filtered.map(mapProductToProduct);
        setProducts(availableProducts);
        setTotalProducts(response.total || 0);
      } else if (response && response.success === false) {
        setProducts([]);
        setError(response.message || 'Error reloading products');
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      const errorMessage = err?.message || '';
      if (errorMessage.toLowerCase().includes('api key')) {
        setProducts([]);
        setError('polar_not_configured');
      } else {
        console.error('Error reloading products:', err);
        setProducts([]);
        setError('Error reloading products');
      }
    } finally {
      setLoading(false);
    }
  };

  // Llamada inicial o cuando cambie página
  useEffect(() => {
    void reloadProducts();
  }, [page]);

  const enrichedProducts = useMemo(() => products, [products]);

  // Filtro local
  const filteredProducts = useMemo(() => {
    if (!activeSearchTerm.trim()) return enrichedProducts;
    return enrichedProducts.filter((product: any) =>
      product.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
    );
  }, [activeSearchTerm, enrichedProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
    setCartItems((prevCart) => {
      const pid = String(product.id);
      const polarProductId = (product as any).polar_id || String(product.id);
      const existing = prevCart.find((item) => item.id === pid);
      if (existing) {
        return prevCart.map((item) =>
          item.id === pid
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      } else {
        const primaryPrice = (product as any).prices?.[0];
        return [
          ...prevCart,
          {
            id: pid,
            polarProductId,
            name: product.name,
            price: product.price,
            priceId: primaryPrice?.id || '',
            stock: product.stock,
            quantity: 1,
            recurring_interval: (product as any).recurring_interval || null,
            productData: product,
          },
        ];
      }
    });
  };

  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleNavigateToPayment = async (
    total: number,
    paymentMethod: string
  ) => {
    if (!user?.id) {
      alert('Please log in to checkout');
      return;
    }

    try {
      const items = cartItems.map((item) => ({
        polarProductId: item.polarProductId,
        priceId: item.priceId,
        quantity: item.quantity,
        productData: item.productData,
      }));

      const metadata = { total_amount: total.toString() };

      if (paymentMethod === 'cash') {
        const { checkoutCashOrder } = await import(
          '@/services/cash-payments.service'
        );
        const cashData = { userId: user.id, items, metadata };
        const response = await checkoutCashOrder(cashData);
        if (response.success && response.checkout_url) {
          window.location.href = response.checkout_url;
        } else {
          throw new Error(response.message || 'Failed to create cash order');
        }
      } else if (paymentMethod === 'crypto') {
        const cartData = {
          userId: user.id,
          items,
          successUrl: `${window.location.origin}/success`,
          metadata,
        };
        const response = await fetch('/api/checkout/crypto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(cartData),
        });
        const data = await response.json();
        if (data.success && data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          throw new Error(data.message || 'Failed to create checkout');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout. Please try again.');
    }
  };

  const handleLocalSearchChange = (value: string) => setLocalSearchTerm(value);

  const updateCartItemQuantity = (
    productId: number | string,
    change: number
  ) => {
    setCartItems((prev) => {
      const updatedItems = prev.map((item) => {
        if (item.id === String(productId)) {
          const actualStock =
            item.productData?.metadata?.quantity || item.stock;
          const newQuantity = Math.max(
            0,
            Math.min(item.quantity + change, actualStock)
          );
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedItems.filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== String(productId))
    );
  };

  const clearCart = () => setCartItems([]);

  // Estados de carga / error
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-main animate-fade-in">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary animate-pulse-glow"></div>
          <p className="text-text-secondary animate-slide-in-left">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error === 'polar_not_configured') {
    const PolarSetupPrompt = require('@/components/PolarSetupPrompt').default;
    return (
      <div className="min-h-screen pt-16 bg-bg-main">
        <HomeHeader
          searchValue={localSearchTerm}
          onSearchChange={handleLocalSearchChange}
          onReload={reloadProducts}
          loading={loading}
        />
        <PolarSetupPrompt
          title="Bienvenido a ZatoBox!"
          subtitle="Para comenzar a gestionar tus productos e inventario, por favor configura tus credenciales de API de Polar en la configuración de tu perfil."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-main animate-fade-in">
        <div className="text-center">
          <div className="mb-4 text-red-500 animate-bounce-in">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="mb-4 text-text-primary animate-slide-in-left">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-medium text-black transition-all duration-300 rounded-lg bg-primary hover:bg-primary-600 hover:scale-105 hover:shadow-lg btn-animate"
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
        className={`transition-all duration-300 ${
          isDrawerOpen ? 'md:pr-[22rem] lg:pr-[26rem] xl:pr-[28rem]' : ''
        }`}
      >
        <HomeHeader
          searchValue={localSearchTerm}
          onSearchChange={handleLocalSearchChange}
          onReload={reloadProducts}
          loading={loading}
        />

        <div className="pt-6 px-4">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-6">
              <HomeStats
                count={filteredProducts.length}
                searchTerm={activeSearchTerm}
              />
            </div>

            <div className="p-6 bg-white border border-gray-300 rounded-lg animate-scale-in">
              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
              />

              {/*  Paginación */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="
                    px-4 py-2 
                    duration-300
                    hover:text-zatobox-500 
                    disabled:opacity-50 
                    disabled:hover:text-inherit
                    group
                    cursor-pointer 
                     "
                >
                  <span
                    className={`
                    w-8 h-8         
                    flex items-center justify-center 
                    transition-transform duration-300 
                    ${page !== 1 ? 'group-hover:scale-132' : ''}
                    `}
                  >
                    <IoMdArrowRoundBack />
                  </span>
                </button>

                <span className="text-sm text-gray-700">
                  Página {page} / {Math.ceil(totalProducts / pageSize) || 1}
                </span>

                <button
                  disabled={page * pageSize >= totalProducts}
                  onClick={() => setPage((p) => p + 1)}
                  className="
                    px-4 py-2 
                    duration-300
                    hover:text-zatobox-500 
                    disabled:opacity-50 
                    disabled:hover:text-inherit
                    group 
                    cursor-pointer 
                     "
                >
                  <span
                    className={`
                    w-8 h-8
                    flex items-center justify-center 
                    transition-transform duration-300 
                    ${
                      page * pageSize < totalProducts
                        ? 'group-hover:scale-132'
                        : ''
                    }
                    `}
                  >
                    <IoMdArrowRoundForward />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalesDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onNavigateToPayment={handleNavigateToPayment}
        cartItems={cartItems as any}
        updateCartItemQuantity={updateCartItemQuantity}
        removeCartItem={removeFromCart}
        clearCart={clearCart}
      />
    </>
  );
};

export default HomePage;
