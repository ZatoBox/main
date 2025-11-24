'use client';

import React, { useState, useMemo, useEffect } from 'react';
import HomeHeader from '@/components/home/HomeHeader';
import ProductGrid from '@/components/home/ProductGrid';
import HomeStats from '@/components/home/HomeStats';
import SKUSearchModal from '@/components/home/SKUSearchModal';
import SalesDrawer from '@/components/SalesDrawer';
import BTCPayModal from '@/components/btcpay/BTCPayModal';
import { getActiveProducts } from '@/services/api.service';
import { btcpayAPI } from '@/services/btcpay.service';
import { confirmCryptoOrder } from '@/services/crypto-payments.service';
import { useBTCPayCheckout } from '@/hooks/use-btcpay-checkout';
import type { Product } from '@/types/index';
import { useAuth } from '@/context/auth-store';
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from 'react-icons/io';
import { ShoppingCart, X } from 'lucide-react';

const mapProductToProduct = (p: any): Product => {
  const imageUrls = Array.isArray(p.images)
    ? p.images.filter(
        (img: any) => typeof img === 'string' && img.trim() !== ''
      )
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
  const { token } = useAuth();
  const {
    isLoading: isBTCPayLoading,
    error: btcpayError,
    showPaymentModal,
    invoiceData,
    createInvoice,
    startPolling,
    closeModal,
  } = useBTCPayCheckout();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSKUModalOpen, setIsSKUModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasXpub, setHasXpub] = useState<boolean | null>(null);
  const [userXpub, setUserXpub] = useState<string | null>(null);

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
        const filtered = rows.filter((p: any) => p.active === true);
        const availableProducts = filtered.map(mapProductToProduct);
        setProducts(availableProducts);
        setTotalProducts(availableProducts.length);
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

    // Verificar si tiene XPUB configurado
    if (isAuthenticated && token) {
      try {
        const xpubResponse = await btcpayAPI.getXpub(token);
        setHasXpub(!!xpubResponse.xpub);
        setUserXpub(xpubResponse.xpub || null);
      } catch (err) {
        console.error('Error checking XPUB:', err);
        setHasXpub(false);
        setUserXpub(null);
      }
    }
  };

  // Llamada inicial o cuando cambie página
  useEffect(() => {
    void reloadProducts();
  }, [page]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsDrawerOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        setIsSKUModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const enrichedProducts = useMemo(() => products, [products]);

  // Filtro local
  const filteredProducts = useMemo(() => {
    let result = enrichedProducts;
    if (activeSearchTerm.trim()) {
      result = enrichedProducts.filter((product: any) =>
        product.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
      );
    }
    return result.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }, [activeSearchTerm, enrichedProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
    addToCart(product, 1);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevCart) => {
      const pid = String(product.id);
      const polarProductId = (product as any).polar_id || String(product.id);
      const existing = prevCart.find((item) => item.id === pid);
      if (existing) {
        return prevCart.map((item) =>
          item.id === pid
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
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
            quantity: Math.min(quantity, product.stock),
            recurring_interval: (product as any).recurring_interval || null,
            productData: product,
          },
        ];
      }
    });
  };

  const handleSKUAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleToggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleNavigateToPayment = async (
    total: number,
    paymentMethod: string
  ) => {
    if (!user?.id) {
      alert('Please log in to checkout');
      return;
    }

    setPaymentMethod(paymentMethod);

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
        const cashItems = cartItems.map((item) => ({
          productId: String(item.id),
          quantity: item.quantity,
          price: item.price,
        }));
        const response = await checkoutCashOrder({
          items: cashItems,
        });
        if (!response.success) {
          throw new Error(response.message || 'Failed to create cash order');
        }
      } else if (paymentMethod === 'crypto') {
        const invoiceId = await createInvoice(total, 'USD', {
          orderId: `order-${Date.now()}`,
          itemDesc: `${cartItems.length} productos`,
          items: cartItems.map((item) => ({
            productId: String(item.id),
            quantity: item.quantity,
            price: item.price,
            productData: {
              name: item.name,
              image: item.productData?.images?.[0] || '',
              price: item.price,
            },
          })),
          paymentType: 'btc',
        });

        if (!invoiceId) {
          const errorMsg =
            btcpayError ||
            'Error al crear el invoice de Bitcoin. Por favor intenta de nuevo.';
          alert(errorMsg);
          return;
        }

        startPolling(invoiceId, () => {
          clearCart();
          reloadProducts();
        });
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage =
        error?.message || 'Failed to create checkout. Please try again.';
      alert(errorMessage);
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
          onToggleCart={handleToggleDrawer}
          onToggleSKU={() => setIsSKUModalOpen(!isSKUModalOpen)}
          cartItemsCount={cartItems.length}
          isCartOpen={isDrawerOpen}
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
          onToggleCart={handleToggleDrawer}
          onToggleSKU={() => setIsSKUModalOpen(!isSKUModalOpen)}
          cartItemsCount={cartItems.length}
          isCartOpen={isDrawerOpen}
        />

        {hasXpub === false && (
          <div className="mx-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-slide-down">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">
                  ⚠️ Wallet no configurada
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Para recibir pagos en Bitcoin, debes configurar tu XPUB en tu
                  perfil.{' '}
                  <a
                    href="/profile"
                    className="font-semibold underline hover:text-yellow-900"
                  >
                    Ir a perfil →
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

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
        onPaymentSuccess={reloadProducts}
      />

      <SKUSearchModal
        isOpen={isSKUModalOpen}
        onClose={() => setIsSKUModalOpen(false)}
        products={products}
        onAddToCart={handleSKUAddToCart}
      />

      {showPaymentModal && invoiceData && (
        <BTCPayModal
          isOpen={showPaymentModal}
          invoiceId={invoiceData.invoiceId}
          amount={invoiceData.amount}
          currency={invoiceData.currency}
          paymentUrl={invoiceData.paymentUrl}
          status={invoiceData.status}
          onConfirmPayment={async (invoiceId: string) => {
            const response = await confirmCryptoOrder(invoiceId);
            if (response.success && response.order) {
              closeModal();
              setCartItems([]);
              reloadProducts();
            }
          }}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default HomePage;
