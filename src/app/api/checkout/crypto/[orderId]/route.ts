import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { status } = body as { status?: string };

    if (status !== 'cancelled') {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: order, error: fetchError } = await supabase
      .from('cash_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status === 'cancelled') {
      return NextResponse.json({ success: true, order }, { status: 200 });
    }

    const items = Array.isArray(order.items) ? order.items : [];

    for (const item of items) {
      const productId = item.productId;
      const quantity = Number(item.quantity) || 0;
      if (!productId || quantity <= 0) continue;

      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      const currentStock = product?.stock || 0;
      await supabase
        .from('products')
        .update({ stock: currentStock + quantity })
        .eq('id', productId);
    }

    const { data: updated, error: updateError } = await supabase
      .from('cash_orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}


