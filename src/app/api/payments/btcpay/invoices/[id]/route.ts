import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const invoiceId = id;

    const result = await btcpayService.getInvoiceStatus(invoiceId);
    const invoice = result.invoice;

    const paymentUrl =
      invoice.paymentMethods?.[0]?.paymentLink ||
      invoice.paymentMethods?.[0]?.destination ||
      invoice.checkoutLink;

    return NextResponse.json({
      success: true,
      status: invoice.status,
      invoice: {
        id: invoice.id,
        amount: invoice.amount,
        currency: invoice.currency,
        checkoutLink: invoice.checkoutLink,
        paymentUrl,
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
