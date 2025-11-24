import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { BTCPayService } from '@/backend/payments/btcpay/service';

const BTCPAY_WEBHOOK_SECRET = process.env.BTCPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!BTCPAY_WEBHOOK_SECRET) {
    console.error('BTCPAY_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const sig = req.headers.get('btcpay-sig');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const computedSig =
    'sha256=' +
    crypto
      .createHmac('sha256', BTCPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

  if (sig !== computedSig) {
    console.warn('⚠️ Firma incorrecta');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (!process.env.BTCPAY_URL || !process.env.BTCPAY_API_KEY) {
    return NextResponse.json(
      { error: 'BTCPay configuration missing' },
      { status: 500 }
    );
  }

  const btcpayService = new BTCPayService(
    process.env.BTCPAY_URL,
    process.env.BTCPAY_API_KEY
  );

  try {
    await btcpayService.processWebhook(sig, rawBody, BTCPAY_WEBHOOK_SECRET);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
