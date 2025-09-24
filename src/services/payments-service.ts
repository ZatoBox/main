import axios from 'axios';

export const getProducts = async () => {
  const response = await axios.get('/api/subscriptions/products');
  return response.data;
};

export const createCheckout = async (
  userId: string,
  plan: string,
  cycle: string
) => {
  const response = await axios.post('/api/subscriptions/checkout', {
    userId,
    plan,
    cycle,
  });
  return response.data;
};

export const checkoutPolarCart = async (cartData: {
  userId?: string;
  items: Array<{
    polarProductId: string;
    priceId: string;
    quantity: number;
    productData: any;
  }>;
  successUrl?: string;
  metadata?: any;
  ownerId?: string;
}) => {
  const response = await axios.post('/api/checkout/polar', cartData);
  return response.data;
};
