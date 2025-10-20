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
    const { storeName, xpub } = body;

    if (!storeName) {
      return NextResponse.json(
        { success: false, message: 'Store name is required' },
        { status: 400 }
      );
    }

    const userStore = await btcpayService.createUserStore(userId, storeName);

    if (xpub) {
      await btcpayService.setupUserWallet(userId, xpub);
    }

    return NextResponse.json({
      success: true,
      store: userStore,
      message: 'Store created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to setup store',
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

    const userStore = await btcpayService.getUserStore(userId);

    if (!userStore) {
      return NextResponse.json({
        success: true,
        store: null,
        message: 'No store found',
      });
    }

    return NextResponse.json({
      success: true,
      store: userStore,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get store',
      },
      { status: 500 }
    );
  }
});
