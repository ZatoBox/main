import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { AuthService } from '@/../backend/auth/service';
import { polarAPI } from '@/utils/polar.utils';
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
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    if (!verifyPolarSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(payload);
    const eventType = data.type;
    const eventData = data.data || {};

    console.log(`Webhook received${userId ? ` for user ${userId}` : ''}:`, {
      type: eventType,
      id: eventData.id,
      status: eventData.status,
    });

    if (
      ![
        'subscription.created',
        'subscription.updated',
        'subscription.active',
        'subscription.canceled',
        'subscription.revoked',
        'checkout.created',
        'checkout.updated',
        'order.created',
        'order.paid',
      ].includes(eventType)
    ) {
      return NextResponse.json({ status: 'ignored' });
    }

    const supabase = await createClient();

    if (eventType.startsWith('subscription.')) {
      await handleSubscriptionEvent(supabase, eventType, eventData);
    } else if (eventType.startsWith('checkout.')) {
      await handleCheckoutEvent(supabase, userId, eventType, eventData);
    } else if (eventType.startsWith('order.')) {
      await handleOrderEvent(supabase, userId, eventType, eventData);
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

async function handleSubscriptionEvent(
  supabase: any,
  eventType: string,
  eventData: any
) {
  const polarSubId = eventData.id;
  if (!polarSubId) return;

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
  } else {
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

    if (eventData.product?.name) updateData.plan = eventData.product.name;
    if (eventData.recurring_interval)
      updateData.cycle = eventData.recurring_interval;
    if (eventData.canceled_at)
      updateData.end_date = new Date(eventData.canceled_at).toISOString();

    await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('polar_subscription_id', polarSubId);
  }
}

async function handleCheckoutEvent(
  supabase: any,
  userId: string | null,
  eventType: string,
  eventData: any
) {
  const status = eventData.status;

  if (eventType === 'checkout.created') {
    console.log(
      `Checkout created${userId ? ` for user ${userId}` : ''}:`,
      eventData.id
    );
  } else if (eventType === 'checkout.updated') {
    if (status === 'succeeded') {
      console.log(
        `Checkout succeeded${userId ? ` for user ${userId}` : ''}:`,
        eventData.id
      );

      if (userId) {
        await updateProductStock(userId, eventData);
      }
    } else if (status === 'failed') {
      console.log(
        `Checkout failed${userId ? ` for user ${userId}` : ''}:`,
        eventData.id
      );
    }
  }
}

async function handleOrderEvent(
  supabase: any,
  userId: string | null,
  eventType: string,
  eventData: any
) {
  if (eventType === 'order.created') {
    console.log(
      `Order created${userId ? ` for user ${userId}` : ''}:`,
      eventData.id
    );
  } else if (eventType === 'order.paid') {
    console.log(
      `Order paid${userId ? ` for user ${userId}` : ''}:`,
      eventData.id
    );

    if (userId) {
      try {
        const authService = new AuthService();
        await authService.updateProfile(userId, {
          last_successful_order: eventData.id,
          last_order_date: new Date().toISOString(),
        });

        console.log(
          `Updated user profile for successful order: ${eventData.id}`
        );
      } catch (error) {
        console.error('Failed to update user profile:', error);
      }
    }
  }
}

async function updateProductStock(userId: string, checkoutData: any) {
  try {
    const authService = new AuthService();
    const profile = await authService.getProfileUser(userId);
    const polarApiKey = profile.user?.polar_api_key;

    if (!polarApiKey) {
      console.error('No Polar API key found for user:', userId);
      return;
    }

    const product = checkoutData.product;
    if (!product || !product.metadata) {
      console.error('No product or metadata found in checkout data');
      return;
    }

    const cartItems = JSON.parse(product.metadata.items || '[]');

    for (const item of cartItems) {
      if (!item.polarProductId) continue;

      const productId = item.polarProductId;
      const quantityPurchased = item.quantity || 1;

      try {
        const currentProduct = await polarAPI.getProduct(
          polarApiKey,
          productId
        );
        const currentStock = currentProduct.metadata?.quantity || 0;
        const newStock = Math.max(0, currentStock - quantityPurchased);

        await polarAPI.updateProduct(polarApiKey, productId, {
          metadata: {
            ...currentProduct.metadata,
            quantity: newStock,
          },
        });

        console.log(
          `Updated stock for product ${productId}: ${currentStock} -> ${newStock}`
        );
      } catch (error) {
        console.error(
          `Failed to update stock for product ${productId}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
  }
}
