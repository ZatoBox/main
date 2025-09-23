'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import WebHero from '@/components/web-layout/WebHero';
import WebCardsContainer from '@/components/web-layout/WebCardsContainer';
import WebCards from '@/components/web-layout/WebCards';
import SalesDrawer from '@/components/SalesDrawer';
import { layoutAPI } from '@/services/api.service';
import { getActiveProducts, getProductsByUserId } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';
import type { Layout, Product } from '@/types';
import { mapPolarProductToProduct } from '@/utils/polar.utils';
import WebShoppingList from '@/components/web-layout/WebShoppingList';

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

export default function ZatoLinkPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [layout, setLayout] = useState<Layout | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const isOwner = !!(user && layout && user.id === layout.owner_id);

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

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleNavigateToPayment = async (total: number) => {
    if (!user?.id) {
      alert('Please log in to checkout');
      return;
    }

    try {
      const { checkoutPolarCart } = await import('@/services/payments-service');

      const cartData = {
        userId: user.id,
        items: cartItems.map((item) => ({
          polarProductId: item.polarProductId,
          priceId: item.priceId,
          quantity: item.quantity,
          productData: item.productData,
        })),
        successUrl: `${window.location.origin}/success`,
        metadata: {
          total_amount: total.toString(),
        },
      };

      const response = await checkoutPolarCart(cartData);

      if (response.success && response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error(response.message || 'Failed to create checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout. Please try again.');
    }
  };

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

  const clearCart = () => {
    setCartItems([]);
  };

  // search data when load page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const layoutResponse = await layoutAPI.getBySlug(slug);
        if (layoutResponse.success) {
          setLayout(layoutResponse.layout);

          try {
            const productsResponse = await getProductsByUserId(
              layoutResponse.layout.owner_id
            );
            if (
              productsResponse.success &&
              Array.isArray(productsResponse.products)
            ) {
              const rows: any[] = productsResponse.products;
              const filtered = rows.filter(
                (p: any) => !(p.is_archived ?? p.is_archived)
              );
              const availableProducts = filtered.map(
                mapPolarProductToProduct
              ) as Product[];
              setProducts(availableProducts);
            } else {
              setProducts([]);
            }
          } catch (productError) {
            console.warn('Could not load products:', productError);
            setProducts([]);
          }
        } else {
          setError('Store not found');
        }
      } catch (err: any) {
        console.error('Error loading page:', err);
        setError('Error loading the page');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const handleShareClick = () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: layout?.hero_title || 'My Store',
        url: currentUrl,
      });
    } else {
      navigator.clipboard.writeText(currentUrl);
      alert('Store link copied to clipboard!');
    }
  };

  const handleCartClick = () => {
    setIsDrawerOpen(true);
  };

  const handleBannerUpdated = (bannerUrl: string) => {
    if (layout) {
      setLayout({ ...layout, banner: bannerUrl });
    }
  };

  const handleLayoutUpdated = (updates: Partial<Layout>) => {
    setLayout((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Store...</p>
        </div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Store not found
          </h1>
          <p className="text-gray-600">
            {error || 'This store does not exist or was removed.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen bg-background transition-all duration-300`}>
        <WebHero
          title={layout.hero_title || 'My Store'}
          description={layout.web_description || ''}
          isOwner={isOwner}
          layoutSlug={slug}
          bannerUrl={layout.banner || undefined}
          onBannerUpdated={handleBannerUpdated}
          onLayoutUpdated={handleLayoutUpdated}
        />

        <main className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className={'text-muted-foreground text-lg'}>
                No product available at the moment
              </p>
            </div>
          ) : (
            <WebCardsContainer
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search products..."
              onShareClick={handleShareClick}
              onCartClick={handleCartClick}
              cartItemsCount={cartItems.length}
            >
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found for "{searchTerm}"
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <WebCards
                    key={product.id}
                    productId={(product as any).polar_id || product.id}
                    storeSlug={slug}
                    title={product.name}
                    description={product.description || ''}
                    price={product.price}
                    image={product.images?.[0]}
                    stock={product.stock}
                    onBuyClick={() => handleProductClick(product)}
                  />
                ))
              )}
            </WebCardsContainer>
          )}
          <WebShoppingList />
        </main>
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
}
