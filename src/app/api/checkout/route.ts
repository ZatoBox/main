import { NextRequest, NextResponse } from 'next/server';
import { CartCacheService } from '@/services/cart-cache.service';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Checkout not available' },
    { status: 501 }
  );
}
