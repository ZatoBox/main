import { api } from '@/utils/polar/polar';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { cartAmount, productId } = await request.json();

  try {
    const checkout = await api.checkouts.create({
      products: [productId],
      amount: cartAmount * 100,
      successUrl: `${process.env.NEXT_PUBLIC_URL}/confirmation?checkout_id={CHECKOUT_ID}`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
