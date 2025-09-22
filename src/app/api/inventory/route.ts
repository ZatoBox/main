import { NextRequest, NextResponse } from 'next/server';
import { InventoryService } from '@/../backend/back/inventory/service';

const service = new InventoryService();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace('/api/inventory', '') || '/';
  try {
    if (pathname === '/' || pathname === '') {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      const inventory = await service.getInventoryResponse(userId);
      return NextResponse.json(inventory);
    }
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'user') {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      const inventory = await service.getInventoryResponse(userId);
      return NextResponse.json(inventory);
    }
    if (parts[0] === 'summary') {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      const summary = await service.getInventorySummary(userId);
      return NextResponse.json({ success: true, summary });
    }
    if (parts[0] === 'low-stock') {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      const q = url.searchParams.get('threshold') || '0';
      const threshold = parseInt(q, 10) || 0;
      const items = await service.checkLowStock(userId, threshold);
      return NextResponse.json({ success: true, low_stock_products: items });
    }
    if (parts[0] === 'user' || parts[0] === '') {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      const inventory = await service.getInventoryResponse(userId);
      return NextResponse.json(inventory);
    }
    if (parts[0]) {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      const item = await service.getInventoryItem(userId, parts[0]);
      if (!item)
        return NextResponse.json(
          { success: false, message: 'Product not found in inventory' },
          { status: 404 }
        );
      return NextResponse.json({ success: true, product: item });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname
      .replace('/api/inventory', '')
      .split('/')
      .filter(Boolean);
    if (!parts[0])
      return NextResponse.json(
        { success: false, message: 'Missing product id' },
        { status: 400 }
      );
    const productId = parts[0];
    const body = await req.json();
    const quantity = body.quantity as number;
    const reason = body.reason as string | undefined;
    const userId = req.headers.get('x-user-id') || 'anonymous';
    await service.updateStock();
    return NextResponse.json(
      { success: false, message: 'Updating stock not supported' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
