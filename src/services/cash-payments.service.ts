import type { CashOrder } from '@/backend/payments/cash/models';

export interface CashCheckoutRequest {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export const checkoutCashOrder = async (
  orderData: CashCheckoutRequest
): Promise<{ success: boolean; order?: CashOrder; message?: string }> => {
  const response = await fetch('/api/checkout/cash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const getCashOrders = async (
  orderId?: string
): Promise<{
  success: boolean;
  order?: CashOrder;
  orders?: CashOrder[];
  message?: string;
}> => {
  const url = new URL('/api/checkout/cash', window.location.origin);
  if (orderId) {
    url.searchParams.append('orderId', orderId);
  }

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};
