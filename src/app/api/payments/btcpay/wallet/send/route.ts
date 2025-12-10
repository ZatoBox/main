import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/modules/backend/payments/btcpay/service';
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
    const { destination, amount, feeRate, subtractFromAmount } = body;

    if (!destination || !feeRate) {
      return NextResponse.json(
        { success: false, message: 'Destination and feeRate are required' },
        { status: 400 }
      );
    }

    const transaction = await btcpayService.sendFunds(userId, {
      destination,
      amount,
      feeRate,
      subtractFromAmount,
    });

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error: any) {
    console.error('Error sending funds:', error);

    let errorMessage = 'Failed to send funds';
    if (error.response?.data) {
      const data = error.response.data;
      if (Array.isArray(data)) {
        errorMessage = data.map((e: any) => e.message || e).join(', ');
      } else if (data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: error.response?.status || 500 }
    );
  }
});
