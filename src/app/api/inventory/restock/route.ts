import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { AuthService } from '@/backend/auth/service';

async function getUserId(req: NextRequest): Promise<string | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const authService = new AuthService();
    const user = await authService.verifyToken(token);
    return user.id || null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid items' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || quantity === undefined || quantity < 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid product or quantity' },
          { status: 400 }
        );
      }

      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (fetchError || !product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${productId}` },
          { status: 404 }
        );
      }

      const currentStock = product.stock || 0;
      const newStock = currentStock + quantity;

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (updateError) {
        return NextResponse.json(
          { success: false, message: `Failed to update product: ${productId}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: 'Restock completed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Restock error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process restock' },
      { status: 500 }
    );
  }
}
