import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

function verifyPolarSignature(payload: string, signature: string): boolean {
  const secret = process.env.POLAR_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const receivedSignature = signature.replace('sha256=', '');
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-polar-signature') || '';

    if (!verifyPolarSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(payload);
    const eventType = data.type;
    const eventData = data.data || {};

    if (
      ![
        'subscription.created',
        'subscription.updated',
        'subscription.active',
        'subscription.canceled',
        'subscription.revoked',
      ].includes(eventType)
    ) {
      return NextResponse.json({ status: 'ignored' });
    }

    const supabase = await createClient();
    const polarSubId = eventData.id;

    if (!polarSubId) {
      return NextResponse.json(
        { error: 'Missing subscription ID' },
        { status: 400 }
      );
    }

    if (eventType === 'subscription.created') {
      const subscriptionData = {
        user_id: eventData.customer_id || '',
        plan: eventData.product?.name || '',
        cycle: eventData.recurring_interval || 'monthly',
        status: 'created',
        start_date: new Date(eventData.created_at).toISOString(),
        polar_subscription_id: polarSubId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabase.from('subscriptions').insert(subscriptionData);
    } else if (
      [
        'subscription.updated',
        'subscription.active',
        'subscription.canceled',
        'subscription.revoked',
      ].includes(eventType)
    ) {
      const statusMap: Record<string, string> = {
        'subscription.active': 'active',
        'subscription.canceled': 'canceled',
        'subscription.revoked': 'revoked',
        'subscription.updated': eventData.status || 'active',
      };

      const updateData: any = {
        status: statusMap[eventType],
        updated_at: new Date().toISOString(),
      };

      if (eventData.product?.name) {
        updateData.plan = eventData.product.name;
      }

      if (eventData.recurring_interval) {
        updateData.cycle = eventData.recurring_interval;
      }

      if (eventData.canceled_at) {
        updateData.end_date = new Date(eventData.canceled_at).toISOString();
      }

      await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('polar_subscription_id', polarSubId);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
