import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { CartCacheService } from '@/services/cart-cache.service';
import crypto from 'crypto';

function verifyPolarSignature(payload: string, signature: string): boolean {
  const secret = process.env.POLAR_WEBHOOK_CHECKOUT_SECRET;
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

    if (eventType !== 'order.paid') {
      return NextResponse.json({ status: 'ignored' });
    }

    const metadata = eventData.checkout?.metadata || {};
    const isCartCheckout = metadata.cart_override === 'true';

    if (!isCartCheckout) {
      return NextResponse.json({ status: 'not_cart_checkout' });
    }

    const isSuccess = true;

    if (isSuccess) {
      const checkoutId = eventData.checkout_id || eventData.checkout?.id;

      if (!checkoutId) {
        return NextResponse.json(
          { error: 'Checkout ID no encontrado' },
          { status: 400 }
        );
      }

      const cartData = CartCacheService.getCart(checkoutId);

      if (!cartData) {
        return NextResponse.json(
          { error: 'Datos del carrito no encontrados' },
          { status: 404 }
        );
      }

      const supabase = await createClient();

      const orderData = {
        user_id: cartData.userId,
        order_id: eventData.id,
        checkout_id: checkoutId,
        total_amount: cartData.totalAmount,
        currency: 'USD',
        status: 'completed',
        payment_method: 'polar',
        items: cartData.items,
        billing_info: cartData.billingInfo,
        shipping_info: cartData.shippingInfo,
        metadata: {
          ...cartData.metadata,
          polar_order_id: eventData.id,
          polar_amount: eventData.amount,
          processed_at: new Date().toISOString(),
        },
      };

      const { error: insertError } = await supabase
        .from('orders')
        .insert(orderData);

      if (insertError) {
        console.error('Error guardando orden:', insertError);
        return NextResponse.json(
          { error: 'Error guardando orden' },
          { status: 500 }
        );
      }

      const { data: stockResult, error: stockError } = await supabase.rpc(
        'decrease_product_stock',
        { product_items: cartData.items }
      );

      if (stockError || !stockResult?.success) {
        console.error(
          'Error actualizando stock:',
          stockError || stockResult?.error
        );
        return NextResponse.json(
          { error: 'Error actualizando stock' },
          { status: 500 }
        );
      }

      CartCacheService.removeCart(checkoutId);

      return NextResponse.json({
        success: true,
        message: 'Orden guardada y stock actualizado',
        order_id: eventData.id,
        checkout_id: checkoutId,
        stock_updates: stockResult.updated_products,
      });
    }

    return NextResponse.json({ status: 'payment_not_successful' });
  } catch (error) {
    console.error('❌ Error en webhook de carrito:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
