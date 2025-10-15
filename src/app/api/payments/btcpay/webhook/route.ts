import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';

const btcpayService = new BTCPayService(
  process.env.BTCPAY_URL!,
  process.env.BTCPAY_API_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('btcpay-sig');
    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Missing signature' },
        { status: 400 }
      );
    }

    const body = await req.text();
    const payload = JSON.parse(body);

    const userStore = await btcpayService.getUserStoreByBtcPayId(
      payload.storeId
    );

    if (!userStore?.webhook_secret) {
      return NextResponse.json(
        {
          success: false,
          message: 'Store not found or webhook secret missing',
        },
        { status: 400 }
      );
    }

    await btcpayService.processWebhook(
      signature,
      body,
      userStore.webhook_secret
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Webhook processing failed',
      },
      { status: 500 }
    );
  }
}
