import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware/auth';

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
        },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce((sum: number, item: any) => {
      const itemPrice = item.productData?.price || 0;
      return sum + itemPrice * (item.quantity || 1);
    }, 0);

    const invoiceData = {
      amount: totalAmount.toString(),
      currency: 'USD',
    };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/payments/btcpay/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to create invoice',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      checkout_url: data.checkoutLink || data.checkout_url,
      ...data,
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
