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

    const body = await req.json();
    const { publicKey } = body;

    if (!publicKey || typeof publicKey !== 'string' || !publicKey.trim()) {
      return NextResponse.json(
        { success: false, message: 'Valid public key is required' },
        { status: 400 }
      );
    }

    await btcpayService.saveUserXpub(userId, publicKey.trim());

    return NextResponse.json({
      success: true,
      message: 'XPUB saved successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to save XPUB',
      },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async (req: NextRequest, userId: string) => {
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

    const userXpub = await btcpayService.getUserXpub(userId);

    return NextResponse.json({
      success: true,
      xpub: userXpub || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get XPUB',
      },
      { status: 500 }
    );
  }
});
