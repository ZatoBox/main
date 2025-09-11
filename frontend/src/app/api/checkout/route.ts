import { api } from '@/utils/polar/polar';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { cartAmount } = await request.json();

  try {
    const checkout = await api.checkouts.create({
      products: [process.env.POLAR_PRODUCT_ID!],
      amount: cartAmount * 100,
      successUrl: `${process.env.NEXT_PUBLIC_URL}/confirmation?checkout_id={CHECKOUT_ID}`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.log('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
