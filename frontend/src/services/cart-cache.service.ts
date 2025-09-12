interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  metadata?: Record<string, any>;
}

interface CartData {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  billingInfo?: Record<string, any>;
  shippingInfo?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: number;
}

const cartCache = new Map<string, CartData>();

export class CartCacheService {
  static saveCart(checkoutId: string, cartData: CartData): void {
    cartCache.set(checkoutId, cartData);

    setTimeout(() => {
      cartCache.delete(checkoutId);
    }, 30 * 60 * 1000);
  }

  static getCart(checkoutId: string): CartData | undefined {
    return cartCache.get(checkoutId);
  }

  static removeCart(checkoutId: string): void {
    cartCache.delete(checkoutId);
  }

  static clearExpiredCarts(): void {
    const now = Date.now();
    const expireTime = 30 * 60 * 1000;

    for (const [checkoutId, cart] of cartCache.entries()) {
      if (now - cart.timestamp > expireTime) {
        cartCache.delete(checkoutId);
      }
    }
  }
}

setInterval(CartCacheService.clearExpiredCarts, 5 * 60 * 1000);
