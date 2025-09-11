import { NextRequest, NextResponse } from 'next/server';
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
      return NextResponse.json({
        success: true,
        message: 'Pago confirmado',
        order_id: eventData.id,
        checkout_id: eventData.checkout_id,
        amount: eventData.amount / 100,
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
