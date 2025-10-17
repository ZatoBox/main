import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';
import { TorGatewayClient } from '@/backend/payments/btcpay/tor-gateway-client';
import { withAuth } from '@/app/api/middleware/auth';

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
    const torGateway = new TorGatewayClient();

    const invoices = await torGateway.get('invoices');

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
