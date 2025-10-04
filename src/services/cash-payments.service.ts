import axios from 'axios';

export const checkoutCashOrder = async (orderData: {
  userId?: string;
  items: Array<{
    polarProductId: string;
    priceId: string;
    quantity: number;
    productData: any;
  }>;
  metadata?: any;
  ownerId?: string;
}) => {
  const response = await axios.post('/api/checkout/cash', orderData);
  return response.data;
};
