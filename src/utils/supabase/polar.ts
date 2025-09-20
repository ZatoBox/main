import axios from 'axios';

const POLAR_BASE_URL = 'https://api.polar.sh/v1';
const POLAR_TOKEN = process.env.POLAR_SECRET_KEY;

export const createCheckoutSession = async (data: {
  subscriptionId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  const response = await axios.post(
    `${POLAR_BASE_URL}/checkouts`,
    {
      subscriptionId: data.subscriptionId,
      customer: { email: data.customerEmail },
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${POLAR_TOKEN}`,
      },
    }
  );
  return response.data;
};
