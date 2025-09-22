import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/utils/polar/polar';

export async function POST(request: NextRequest) {
  try {
    const { plan, cycle, userId } = await request.json();

    const productId =
      cycle === 'monthly'
        ? process.env.POLAR_MONTHLY_SUB
        : process.env.POLAR_ANNUAL_SUB;

    const checkout = await api.checkouts.create({
      products: [productId!],
      successUrl: `${process.env.NEXT_PUBLIC_URL}/confirmation?checkout_id={CHECKOUT_ID}&type=subscription&plan=${plan}&cycle=${cycle}`,
      metadata: { plan, cycle, type: 'subscription', user_id: userId },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
