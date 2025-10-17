import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';
import { TorGatewayClient } from '@/backend/payments/btcpay/tor-gateway-client';
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
      process.env.BTCPAY_API_KEY
    );
    const torGateway = new TorGatewayClient();

    const body = await req.json();
    const { storeName, xpub } = body;

    if (!storeName) {
      return NextResponse.json(
        { success: false, message: 'Store name is required' },
        { status: 400 }
      );
    }

    const existingStore = await btcpayService.getUserStore(userId);
    if (existingStore) {
      return NextResponse.json({
        success: true,
        message: 'Store already exists',
        store: existingStore,
      });
    }

    const userStore = await torGateway.post('stores', {
      name: storeName,
    });

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
      process.env.BTCPAY_API_KEY
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
