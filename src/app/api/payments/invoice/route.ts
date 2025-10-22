import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BTCPAY_URL || !process.env.BTCPAY_API_KEY) {
      return NextResponse.json(
        { error: 'BTCPay configuration missing' },
        { status: 500 }
      );
    }

    const btcpayService = new BTCPayService(
      process.env.BTCPAY_URL,
      process.env.BTCPAY_API_KEY
    );

    const body = await request.json();
    const invoice = await btcpayService.createInvoice('system', body);

    return NextResponse.json(invoice, { status: 200 });
  } catch (error: any) {
    console.error('Invoice creation error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
