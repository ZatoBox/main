import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import VexorCheckout from '../components/VexorCheckout';
import useCart from '../hooks/useCart';
import { PaymentResponse } from '../services/vexorpay';
import type { Product as APIProduct } from '../services/api';

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  stock?: number;
  image?: string | null;
}

const POSPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    getCheckoutSummary,
  } = useCart();

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      // Transform API products to match our interface
      const transformedProducts: Product[] = (response.products || []).map((apiProduct: APIProduct) => ({
        id: apiProduct.id,
        name: apiProduct.name,
        description: apiProduct.description || undefined,
        price: apiProduct.price,
        category: apiProduct.category || undefined,
        stock: (apiProduct as any).inventoryQuantity || apiProduct.stock || 0,
        image: apiProduct.image || undefined
      }));
      setProducts(transformedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category || undefined,
      image: product.image || undefined,
    });
  };

  const handlePaymentSuccess = (payment: PaymentResponse) => {
    console.log('Payment successful:', payment);
    // Here you would typically:
    // 1. Create a sale record in your backend
    // 2. Update inventory
    // 3. Clear the cart
    // 4. Show success message
    clearCart();
    setShowCheckout(false);
    alert(`Payment successful! Payment ID: ${payment.id}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error}`);
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };

  const checkoutSummary = getCheckoutSummary();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={loadProducts}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">ZatoBox POS</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.stock !== undefined && (
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  )}
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Add to Cart
                  </button>
                  
                  {getItemQuantity(product.id) > 0 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      In Cart: {getItemQuantity(product.id)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found.</p>
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="bg-white rounded-lg shadow-md p-4 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Cart ({cart.itemCount} items)
          </h2>

          {cart.items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Cart is empty</p>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-200 rounded text-sm font-bold hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded text-sm font-bold hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 bg-red-200 text-red-600 rounded text-sm font-bold hover:bg-red-300"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${checkoutSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${checkoutSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${checkoutSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Checkout with VexorPay
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-screen overflow-y-auto">
            <VexorCheckout
              items={cart.items}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onCancel={handleCheckoutCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPage;
