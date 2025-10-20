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
      process.env.BTCPAY_API_KEY,
      userId
    );

    const body = await req.json();
    const { amount, currency, metadata, checkout } = body;

    if (!amount || !currency) {
      return NextResponse.json(
        { success: false, message: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    const invoice = await btcpayService.createInvoice(userId, {
      amount,
      currency,
      metadata,
      checkout,
    });

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      checkoutLink: invoice.checkoutLink,
      status: invoice.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create invoice',
      },
      { status: 500 }
    );
  }
});
