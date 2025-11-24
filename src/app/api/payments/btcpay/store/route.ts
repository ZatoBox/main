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
    const { publicKey, storeName, createStore } = body;

    if (publicKey && typeof publicKey === 'string' && publicKey.trim()) {
      const result = await btcpayService.configureUserStore(userId, {
        publicKey: publicKey.trim(),
        storeName: typeof storeName === 'string' ? storeName : undefined,
      });

      return NextResponse.json({
        success: true,
        storeId: result.storeId,
        xpub: result.xpub,
        webhookCreated: result.webhookCreated,
        xpubChanged: result.xpubChanged,
      });
    } else if (createStore === true) {
      const result = await btcpayService.ensureUserStore(userId);
      return NextResponse.json({
        success: true,
        storeId: result.storeId,
        webhookCreated: true,
      });
    } else {
      const store = await btcpayService.getUserStore(userId);
      if (store?.btcpay_store_id) {
        return NextResponse.json({
          success: true,
          storeId: store.btcpay_store_id,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Store not configured',
        });
      }
    }
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

    const store = await btcpayService.getUserStore(userId);
    let xpub: string | null = null;
    if (store?.xpub) {
      try {
        xpub = await btcpayService.getUserXpub(userId);
      } catch (error) {
        xpub = null;
      }
    }

    return NextResponse.json({
      success: true,
      xpub,
      store: store && {
        id: store.btcpay_store_id,
        name: store.store_name,
        webhookConfigured: Boolean(store.webhook_secret),
      },
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
