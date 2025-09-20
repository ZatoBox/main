import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/utils/polar/polar';
import { CartCacheService } from '@/services/cart-cache.service';

export async function POST(request: NextRequest) {
  try {
    const { cartAmount, userId, items, billingInfo, shippingInfo, metadata } =
      await request.json();

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos del carrito incompletos' },
        { status: 400 }
      );
    }

    const checkout = await api.checkouts.create({
      products: [process.env.POLAR_PRODUCT_ID!],
      amount: cartAmount * 100,
      metadata: {
        original_amount: cartAmount.toString(),
        cart_override: 'true',
        user_id: userId,
      },
      successUrl: `${process.env.NEXT_PUBLIC_URL}/confirmation?checkout_id={CHECKOUT_ID}`,
    });

    if (!checkout.id) {
      return NextResponse.json(
        { error: 'Error al crear checkout' },
        { status: 500 }
      );
    }

    CartCacheService.saveCart(checkout.id, {
      userId,
      items,
      totalAmount: cartAmount,
      billingInfo,
      shippingInfo,
      metadata,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      url: checkout.url,
      checkout_id: checkout.id,
    });
  } catch (error) {
    console.error('Error en checkout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
