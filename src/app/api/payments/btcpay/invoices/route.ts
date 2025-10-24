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

    const btcPayment = invoice.paymentMethods?.find(
      (pm: any) =>
        pm.paymentMethodId === 'BTC-CHAIN' || pm.paymentMethodId === 'BTC'
    );

    let paymentUrl = '';
    if (btcPayment?.destination && btcPayment?.amount) {
      paymentUrl = `bitcoin:${btcPayment.destination}?amount=${btcPayment.amount}`;
    } else {
      paymentUrl = invoice.checkoutLink || '';
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      checkoutLink: invoice.checkoutLink,
      paymentUrl: paymentUrl,
      amount: btcPayment?.amount || invoice.amount,
      currency: invoice.currency,
      status: invoice.status,
    });
  } catch (error: any) {
    console.error('BTCPay invoice creation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      fullError: error,
    });
    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'Failed to create invoice',
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
});
