import React from 'react';
import { X, Plus, Minus, Trash2, Package } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import WebButton from './WebButton';

const WebShoppingList: React.FC = () => {
    const {
        items,
        isDrawerOpen,
        closeDrawer,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
    } = useCartStore();

    if (!isDrawerOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-transparent bg-opacity-50 z-40"
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl flex flex-col z-50">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">
                        Shopping Cart ({getTotalItems()})
                    </h2>
                    <button
                        onClick={closeDrawer}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                            Your cart is empty
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.productId} className="flex gap-3 p-3 border rounded-lg">
                                    {/* Image */}
                                    <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">{item.name}</h3>
                                        <p className="text-zatobox-600 font-semibold">
                                            ${item.price.toFixed(2)}
                                        </p>

                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="p-1 hover:bg-red-100 text-red-500 rounded ml-auto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-3">
                        <div className="flex justify-between items-center font-semibold">
                            <span>Total:</span>
                            <span className="text-zatobox-600">
                                ${getTotalPrice().toFixed(2)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <WebButton
                                variant="buy"
                                size="md"
                                className="w-full justify-center"
                                onClick={() => {
                                    console.log('Checkout clicked');
                                    // Implementar checkout
                                }}
                            >
                                Checkout
                            </WebButton>

                            <button
                                onClick={clearCart}
                                className="w-full text-sm text-gray-500 hover:text-red-500"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebShoppingList;
