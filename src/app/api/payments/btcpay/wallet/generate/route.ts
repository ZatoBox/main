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

    const btcpayService = new BTCPayService(
      process.env.BTCPAY_URL,
      process.env.BTCPAY_API_KEY,
      userId
    );

    const existingXpub = await btcpayService.getUserXpub(userId);
    if (existingXpub) {
      return NextResponse.json(
        { success: false, message: 'User already has an XPUB' },
        { status: 400 }
      );
    }

    const wallet = await btcpayService.generateUserWallet(userId);

    return NextResponse.json({
      success: true,
      xpub: wallet.xpub,
      message: 'XPUB generated successfully',
    });
  } catch (error: any) {
    console.error('Wallet generation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to generate wallet',
      },
      { status: 500 }
    );
  }
});
