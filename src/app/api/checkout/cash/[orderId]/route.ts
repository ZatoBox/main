import { NextRequest, NextResponse } from 'next/server';
import { CashPaymentService } from '@/backend/payments/cash/service';
import { createClient } from '@/utils/supabase/server';
import { jwtDecode } from 'jwt-decode';

const cashService = new CashPaymentService();

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const decoded = jwtDecode<{
          sub?: string;
          id?: string;
          user_id?: string;
        }>(token);
        return decoded.sub || decoded.id || decoded.user_id || null;
      } catch (e) {
        console.error('Auth: Failed to decode Bearer token:', e);
      }
    }

    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((c) => {
          const [key, ...val] = c.split('=');
          return [decodeURIComponent(key), decodeURIComponent(val.join('='))];
        })
      );

      const token = cookies['zatobox_token'];
      if (token) {
        try {
          const decoded = jwtDecode<{
            sub?: string;
            id?: string;
            user_id?: string;
          }>(token);
          return decoded.sub || decoded.id || decoded.user_id || null;
        } catch (e) {
          console.error('JWT decode error:', e);
        }
      }
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.id || null;
  } catch (error) {
    return null;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['cancelled', 'returned'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status. Must be "cancelled" or "returned"',
        },
        { status: 400 }
      );
    }

    const updatedOrder = await cashService.cancelOrder(
      params.orderId,
      userId,
      status as 'cancelled' | 'returned'
    );

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 200 }
    );
  } catch (error: any) {
    const message = error.message || 'Internal server error';

    if (message === 'Unauthorized') {
      return NextResponse.json({ success: false, message }, { status: 403 });
    }

    if (message === 'Order not found') {
      return NextResponse.json({ success: false, message }, { status: 404 });
    }

    if (message === 'Only completed orders can be cancelled or returned') {
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    console.error('Order cancellation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
