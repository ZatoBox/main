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

export const checkoutCart = async (cartAmount: number, productId: string) => {
  const response = await axios.post('/api/checkout', {
    cartAmount,
    productId,
  });
  return response.data;
};
