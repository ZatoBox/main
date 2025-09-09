import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createCheckoutSession } from '@/utils/supabase/polar';
import { cookies } from 'next/headers';

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
    const polarData = await createCheckoutSession({
      subscriptionId: plan,
      customerEmail: user.email,
      successUrl: `${request.nextUrl.origin}/success`,
      cancelUrl: `${request.nextUrl.origin}/cancel`,
    });

    return NextResponse.json({ checkoutUrl: polarData.url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
