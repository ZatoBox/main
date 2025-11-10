import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';
import { withAuth } from '@/app/api/middleware/auth';

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    if (!process.env.BTCPAY_URL || !process.env.BTCPAY_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'BTCPay configuration missing' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, message: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const btcpayService = new BTCPayService(
      process.env.BTCPAY_URL,
      process.env.BTCPAY_API_KEY,
      userId
    );

    const order = await btcpayService.confirmCryptoOrder(userId, invoiceId);

    return NextResponse.json({
      success: true,
      order,
      message: 'Crypto order confirmed',
    });
  } catch (error: any) {
    console.error('Crypto order confirmation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to confirm crypto order',
      },
      { status: 500 }
    );
  }
});
