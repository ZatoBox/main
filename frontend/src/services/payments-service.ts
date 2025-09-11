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

export const checkoutCart = async (cartData: {
  cartAmount: number;
  userId: string;
  items: any[];
  billingInfo?: any;
  shippingInfo?: any;
  metadata?: any;
}) => {
  const response = await axios.post('/api/checkout', cartData);
  return response.data;
};
