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

    let paymentUrl = '';
    const btcPayment = invoice.paymentMethods?.find(
      (pm) => pm.paymentMethodId === 'BTC-CHAIN' || pm.paymentMethodId === 'BTC'
    );

    if (btcPayment?.destination && btcPayment?.amount) {
      paymentUrl = `bitcoin:${btcPayment.destination}?amount=${btcPayment.amount}`;
    } else {
      paymentUrl = btcPayment?.paymentLink || invoice.checkoutLink || '';
    }

    return NextResponse.json({
      success: true,
      status: invoice.status,
      invoice: {
        id: invoice.id,
        amount: btcPayment?.amount || invoice.amount,
        currency: invoice.currency,
        checkoutLink: invoice.checkoutLink,
        paymentUrl,
        createdTime: invoice.createdTime,
        expirationTime: invoice.expirationTime,
        metadata: invoice.metadata,
      },
    });
  } catch (error: any) {
    console.error('BTCPay get invoice error:', {
      message: error.message,
      code: error.code,
      hostname: error.hostname,
      response: error.response?.data,
      status: error.response?.status,
      fullError: error,
    });

    const statusCode = error.response?.status || 500;
    let errorMessage = error.message || 'Failed to get invoice';

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
}
