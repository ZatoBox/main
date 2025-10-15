import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';
import { withAuth } from '@/app/api/middleware/auth';

const btcpayService = new BTCPayService(
  process.env.BTCPAY_URL!,
  process.env.BTCPAY_API_KEY!
);

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const invoices = await btcpayService.getUserInvoices(userId);

    return NextResponse.json({
      success: true,
      invoices,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get invoices',
      },
      { status: 500 }
    );
  }
});
