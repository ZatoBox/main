import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.BTCPAY_URL || !process.env.BTCPAY_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'BTCPay configuration missing' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { items, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
        },
        { status: 400 }
      );
    }

    const btcpayService = new BTCPayService(
      process.env.BTCPAY_URL,
      process.env.BTCPAY_API_KEY,
      userId
    );

    const totalAmount = items.reduce((sum: number, item: any) => {
      const itemPrice = item.productData?.price || 0;
      return sum + itemPrice * (item.quantity || 1);
    }, 0);

    const cleanedItems = items.map((item: any) => ({
      quantity: item.quantity,
      productData: item.productData,
    }));

    const invoice = await btcpayService.createInvoice(userId, {
      amount: totalAmount.toString(),
      currency: 'USD',
      metadata: {
        items: cleanedItems,
        paymentType: 'lightning',
      },
    });

    return NextResponse.json({
      success: true,
      checkout_url: invoice.checkoutLink,
      invoiceId: invoice.id,
      ...invoice,
    });
  } catch (error: any) {
    console.error('Lightning checkout error:', error);
    console.error('Error response:', error.response?.data);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create invoice',
      },
      { status: 500 }
    );
  }
}

