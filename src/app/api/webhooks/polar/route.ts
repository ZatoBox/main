import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { AuthService } from '@/../backend/auth/service';
import { polarAPI } from '@/utils/polar.utils';
import crypto from 'crypto';

function verifyPolarSignature(payload: string, headers: any): boolean {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) return false;

  // Standard Webhooks requiere base64 encoding del secret
  const encodedSecret = Buffer.from(secret).toString('base64');

  // Headers correctos según Standard Webhooks
  const webhookId = headers.get('webhook-id');
  const webhookSignature = headers.get('webhook-signature');
  const webhookTimestamp = headers.get('webhook-timestamp');

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return false;
  }

  // Crear el payload firmado según Standard Webhooks
  const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`;

  // Generar firma esperada
  const expectedSignature = crypto
    .createHmac('sha256', Buffer.from(encodedSecret, 'base64'))
    .update(signedPayload)
    .digest('base64');

  // Extraer firmas del header (formato: "v1,signature1 v1,signature2")
  const signatures = webhookSignature.split(' ');

  return signatures.some((sig: string) => {
    const [version, signature] = sig.split(',');
    if (!version || !signature) return false;
    try {
      return (
        version === 'v1' &&
        signature &&
        signature.length > 0 &&
        crypto.timingSafeEqual(
          Buffer.from(expectedSignature),
          Buffer.from(signature)
        )
      );
    } catch (e) {
      return false;
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('x-polar-signature') || '';
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    if (!verifyPolarSignature(payload, request.headers)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(payload);
    const eventType = data.type;
    const eventData = data.data || {};
    const resolvedEmail =
      eventData?.customer?.email ||
      eventData?.user?.email ||
      eventData?.metadata?.email ||
      eventData?.product?.metadata?.email ||
      null;

    console.log(`Webhook received${userId ? ` for user ${userId}` : ''}:`, {
      type: eventType,
      id: eventData.id,
      status: eventData.status,
    });

    if (
      !Array.isArray([
        'subscription.created',
        'subscription.updated',
        'subscription.active',
        'subscription.canceled',
        'subscription.revoked',
        'checkout.created',
        'checkout.updated',
        'order.created',
        'order.paid',
      ]) ||
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
      await handleSubscriptionEvent(
        supabase,
        userId,
        eventType,
        eventData,
        resolvedEmail
      );
    } else if (eventType.startsWith('checkout.')) {
      await handleCheckoutEvent(
        supabase,
        userId,
        eventType,
        eventData,
        resolvedEmail
      );
    } else if (eventType.startsWith('order.')) {
      await handleOrderEvent(
        supabase,
        userId,
        eventType,
        eventData,
        resolvedEmail
      );
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
  userId: string | null,
  eventType: string,
  eventData: any,
  email?: string | null
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

    if (eventType === 'subscription.active') {
      const interval = (eventData.recurring_interval || '')
        .toString()
        .toLowerCase();
      const months =
        interval === 'yearly' || interval === 'annual' || interval === 'year'
          ? 12
          : 1;
      if (userId) {
        await promoteUserIfSubscription(userId, {
          metadata: { type: 'subscription', cycle: interval },
        });
      } else if (email) {
        await promoteUserByEmailIfSubscription(email, {
          metadata: { type: 'subscription', cycle: interval },
        });
      }
    }
  }
}

async function handleCheckoutEvent(
  supabase: any,
  userId: string | null,
  eventType: string,
  eventData: any,
  email?: string | null
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
        await deleteCartProduct(userId, eventData);
        await promoteUserIfSubscription(userId, eventData);
      } else if (email) {
        await promoteUserByEmailIfSubscription(email, eventData);
      }
    } else if (status === 'failed') {
      console.log(
        `Checkout failed${userId ? ` for user ${userId}` : ''}:`,
        eventData.id
      );

      if (userId) {
        await deleteCartProduct(userId, eventData);
      }
    }
  }
}

async function handleOrderEvent(
  supabase: any,
  userId: string | null,
  eventType: string,
  eventData: any,
  email?: string | null
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
        await promoteUserIfSubscription(userId, eventData);
      } catch (error) {
        console.error('Failed to update user profile:', error);
      }
    } else if (email) {
      await promoteUserByEmailIfSubscription(email, eventData);
    }
  }
}

async function promoteUserIfSubscription(userId: string, payload: any) {
  try {
    const authService = new AuthService();
    const meta = payload?.metadata || payload?.product?.metadata || {};
    const planType = meta.plan || meta.type;
    const cycle = (meta.cycle || '').toString().toLowerCase();
    if (planType === 'subscription') {
      const months = cycle === 'yearly' || cycle === 'annual' ? 12 : 1;
      await authService.promoteToPremium(userId, months);
    }
  } catch (e) {
    console.error('Failed to promote user to premium:', e);
  }
}

async function promoteUserByEmailIfSubscription(email: string, payload: any) {
  try {
    const authService = new AuthService();
    const meta = payload?.metadata || payload?.product?.metadata || {};
    const planType = meta.plan || meta.type;
    const cycle = (meta.cycle || '').toString().toLowerCase();
    if (planType === 'subscription' || payload?.recurring_interval) {
      const interval =
        cycle || String(payload?.recurring_interval || '').toLowerCase();
      const months = interval === 'yearly' || interval === 'annual' ? 12 : 1;
      await authService.promoteEmailToPremium(email, months);
    }
  } catch (e) {
    console.error('Failed to promote email to premium:', e);
  }
}

async function deleteCartProduct(userId: string, checkoutData: any) {
  try {
    const authService = new AuthService();
    const profile = await authService.getProfileUser(userId);
    const polarApiKey = profile.user?.polar_api_key;

    if (!polarApiKey) {
      console.error('No Polar API key found for user:', userId);
      return;
    }

    console.log(
      'Checkout data structure for product deletion:',
      JSON.stringify(
        {
          id: checkoutData.id,
          metadata: checkoutData.metadata,
          product: checkoutData.product?.id,
          productMetadata: checkoutData.product?.metadata,
        },
        null,
        2
      )
    );

    // Obtener el ID del producto temporal del carrito desde los metadatos del checkout
    const cartProductId =
      checkoutData.metadata?.cart_product_id ||
      checkoutData.product?.id ||
      checkoutData.product?.metadata?.cart_product_id;

    if (cartProductId) {
      try {
        // Eliminar el producto temporal del carrito
        await polarAPI.deleteProduct(polarApiKey, cartProductId);
        console.log(`Deleted temporary cart product: ${cartProductId}`);
      } catch (error) {
        console.error(
          `Failed to delete temporary cart product ${cartProductId}:`,
          error
        );
      }
    } else {
      console.log('No cart product ID found in checkout metadata');
    }
  } catch (error) {
    console.error('Error deleting cart product:', error);
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

    const cartProductId =
      checkoutData.metadata?.cart_product_id ||
      checkoutData.product?.metadata?.cart_product_id ||
      checkoutData.product_id ||
      checkoutData.product?.id;
    if (!cartProductId) {
      console.error('No cart product id found in checkout data');
      return;
    }

    const cartProduct = await polarAPI.getProduct(polarApiKey, cartProductId);
    const cartMetadata = cartProduct?.metadata || {};
    const rawItems = cartMetadata.items;
    if (!rawItems) {
      console.error('No items metadata found for cart product:', cartProductId);
      return;
    }

    const parsedItems = Array.isArray(rawItems)
      ? rawItems
      : (() => {
          try {
            return JSON.parse(rawItems);
          } catch {
            return [];
          }
        })();
    const cartItems = Array.isArray(parsedItems) ? parsedItems : [];

    for (const item of cartItems) {
      if (!item.polarProductId) continue;

      const productId = item.polarProductId;
      const quantityPurchased = Number(item.quantity) || 1;

      try {
        const currentProduct = await polarAPI.getProduct(
          polarApiKey,
          productId
        );
        const currentQuantityRaw = currentProduct.metadata?.quantity;
        const currentStock = Number(currentQuantityRaw) || 0;
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
