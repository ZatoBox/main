import { NextRequest, NextResponse } from 'next/server';
import { CashPaymentService } from '@/backend/payments/cash/service';
import { withAuth } from '@/app/api/middleware/auth';

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const body = await req.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, message: 'Invalid items format' },
        { status: 400 }
      );
    }

    for (const item of body.items) {
      if (!item.productId || !item.quantity || !item.price) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields in items' },
          { status: 400 }
        );
      }
    }

    const service = new CashPaymentService();
    const order = await service.processCashPayment(userId, body.items);

    return NextResponse.json({
      success: true,
      order,
      message: 'Cash payment processed successfully',
    });
  } catch (error: any) {
    console.error('Cash payment error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to process cash payment',
      },
      { status: 500 }
    );
  }
});

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    const service = new CashPaymentService();

    if (orderId) {
      const order = await service.getOrderById(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    const orders = await service.getUserOrders(userId);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to retrieve orders',
      },
      { status: 500 }
    );
  }
});
