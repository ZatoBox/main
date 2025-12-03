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

    let paymentUrl = '';
    const btcPayment = invoice.paymentMethods?.find(
      (pm: any) =>
        pm.paymentMethodId === 'BTC-CHAIN' || pm.paymentMethodId === 'BTC'
    );

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
      code: error.code,
      hostname: error.hostname,
      response: error.response?.data,
      status: error.response?.status,
      fullError: error,
    });

    const statusCode = error.response?.status || 500;
    let errorMessage = 'Failed to create invoice';

    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      errorMessage = `Cannot resolve BTCPay Server hostname (${
        error.hostname || 'unknown'
      }). Please verify BTCPAY_URL in environment variables is correct.`;
    } else if (statusCode === 502 || statusCode === 503) {
      errorMessage =
        error.response?.data?.message ||
        'BTCPay Server is currently unavailable. Please try again in a few moments.';
    } else if (statusCode === 504) {
      errorMessage = 'Request timeout. Please try again.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        status: statusCode,
      },
      { status: statusCode >= 500 ? 503 : statusCode }
    );
  }
});
