import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { api } from '@/utils/polar/polar';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { userId, plan, cycle } = await request.json();

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{ user_id: userId, plan, cycle, status: 'pending' }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    const productId =
      cycle === 'monthly'
        ? process.env.POLAR_MONTHLY_SUB
        : process.env.POLAR_ANNUAL_SUB;

    const checkout = await api.checkouts.create({
      products: [productId!],
      successUrl: `${process.env.NEXT_PUBLIC_URL}/confirmation?checkout_id={CHECKOUT_ID}&type=subscription&plan=${plan}&cycle=${cycle}`,
      metadata: {
        plan,
        cycle,
        type: 'subscription',
        user_id: userId,
        subscription_row_id: data.id,
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
