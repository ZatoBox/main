import React, { useState, useMemo, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';
import SalesDrawer from './SalesDrawer';
import PaymentScreen from './PaymentScreen';
import PaymentSuccessScreen from './PaymentSuccessScreen';
import { productsAPI, salesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  searchTerm?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  sku?: string;
  category: string;
  stock: number;
  price: number;
  status: 'active' | 'inactive';
  image?: string;
  images?: string[];
}

const HomePage: React.FC<HomePageProps> = ({ searchTerm: externalSearchTerm = '' }) => {
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  // @ts-ignore
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
    const fetchProducts = async() => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        if (response.success) {
          // Show active products (allow stock 0 to see all products)
          const availableProducts = response.products.filter(
            (product: Product) => product.status === 'active',
          );
          console.log('Products loaded:', response.products);
          console.log('Available products:', availableProducts);
          setProducts(availableProducts);
        } else {
          setError('Error loading products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error loading products');
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
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!activeSearchTerm.trim()) {
      return products;
    }

    return products.filter(product =>
      product.name.toLowerCase().includes(activeSearchTerm.toLowerCase()),
    );
  }, [activeSearchTerm, products]);

  // When clicking on a product, add it to cart
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
    setCartItems(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        // Add quantity, respecting stock
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item,
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

  const handlePaymentSuccess = async(method: string) => {
    try {
      // Prepare sale data
      const saleData = {
        items: cartItems.map(item => ({
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
        setProducts(prevProducts =>
          prevProducts.map(product => {
            const cartItem = cartItems.find(item => item.id === product.id);
            if (cartItem) {
              return {
                ...product,
                stock: Math.max(0, product.stock - cartItem.quantity),
              };
            }
            return product;
          }),
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
    setCartItems(prev => {
      const updatedItems = prev.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item,
      );
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Function to reload products
  const reloadProducts = async() => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();

      if (response.success) {
        // Show active products (allow stock 0 to see all products)
        const availableProducts = response.products.filter(product => product.status === 'active');
        setProducts(availableProducts);
        console.log('Products reloaded:', response.products);
        console.log('Available products:', availableProducts);
      } else {
        setError('Error reloading products');
      }
    } catch (err) {
      console.error('Error reloading products:', err);
      setError('Error reloading products');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-main animate-fade-in">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary animate-pulse-glow"></div>
          <p className="text-text-secondary animate-slide-in-left">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-bg-main animate-fade-in">
        <div className="text-center">
          <div className="mb-4 text-red-500 animate-bounce-in">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="mb-4 text-text-primary animate-slide-in-left">{error}</p>
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
      <div className={`py-8 transition-all duration-300 ${
        isDrawerOpen && !isPaymentOpen && !isSuccessOpen ? 'md:mr-[40%] lg:mr-[33.333333%]' : ''
      }`}>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-6">
            {/* Title and Search Row */}
            <div className="flex flex-col gap-4 mb-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-text-primary animate-slide-in-left">
                Sales Dashboard
              </h1>

              {/* Search and Refresh Row */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80 animate-slide-in-left">
                  <Search size={20} className="absolute transform -translate-y-1/2 left-3 top-1/2 text-text-secondary icon-bounce" />
                  <input
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => handleLocalSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="w-full py-2 pl-10 pr-4 text-sm transition-all duration-300 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:border-complement/50"
                  />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={reloadProducts}
                  disabled={loading}
                  className="p-2 text-black transition-all duration-300 rounded-lg bg-primary hover:bg-primary-600 hover:scale-110 hover:shadow-lg icon-bounce disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Update products"
                >
                  <RefreshCw size={20} className={`${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary animate-slide-in-right">
              {activeSearchTerm ? (
                <>
                  Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{activeSearchTerm}"
                </>
              ) : (
                'Select products to create sales orders quickly'
              )}
            </p>
          </div>

          {/* Responsive Grid with white background */}
          <div className="p-6 bg-white border rounded-lg border-divider animate-scale-in">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 animate-stagger">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center animate-fade-in">
                <div className="mb-4 text-text-secondary animate-bounce-in">
                  <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-text-primary animate-slide-in-left">
                  No products found
                </h3>
                <p className="text-text-secondary animate-slide-in-right">
                  {activeSearchTerm
                    ? `No products match "${activeSearchTerm}". Try different search terms.`
                    : 'No products available for sale.'
                  }
                </p>
              </div>
            )}
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
        total={paymentTotal}
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
