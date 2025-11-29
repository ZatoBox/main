import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';
import { withAuth } from '@/app/api/middleware/auth';

export const DELETE = withAuth(async (req: NextRequest, userId: string) => {
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

    await btcpayService.deleteUserStore(userId);

    return NextResponse.json({
      success: true,
      message: 'Store deleted successfully',
    });
  } catch (error: any) {
    console.error('Store deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete store',
      },
      { status: 500 }
    );
  }
});
