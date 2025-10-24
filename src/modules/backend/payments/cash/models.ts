export interface CashOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

export interface CashOrder {
  id: string;
  userId: string;
  items: CashOrderItem[];
  totalAmount: number;
  paymentMethod: 'cash';
  status: 'completed' | 'cancelled' | 'returned';
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface CashOrderResponse {
  success: boolean;
  order?: CashOrder;
  message?: string;
}
