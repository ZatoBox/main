import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';

const btcpayService = new BTCPayService(
  process.env.BTCPAY_URL!,
  process.env.BTCPAY_API_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id;

    const { status, invoice } = await btcpayService.getInvoiceStatus(invoiceId);

    return NextResponse.json({
      success: true,
      status,
      invoice: {
        id: invoice.id,
        amount: invoice.amount,
        currency: invoice.currency,
        checkoutLink: invoice.checkoutLink,
        createdTime: invoice.createdTime,
        expirationTime: invoice.expirationTime,
        metadata: invoice.metadata,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get invoice',
      },
      { status: 500 }
    );
  }
}
