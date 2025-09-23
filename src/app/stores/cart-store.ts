import { create } from 'zustand';

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartStore {
    items: CartItem[];
    isDrawerOpen: boolean;
    addItem: (product: Omit<CartItem, 'quantity'>) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    openDrawer: () => void;
    closeDrawer: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isDrawerOpen: false,

    addItem: (product) => {
        try{
            set((state) => {
                const existingItem = state.items.find(item => item.productId === product.productId);
                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.productId === product.productId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    };
                }
                return { items: [...state.items, { ...product, quantity: 1 }] };
            });
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    },

    removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
    })),

    updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        )
    })),

    clearCart: () => set({ items: [] }),

    getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),

    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false })
}));