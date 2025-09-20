import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/../backend/back/category/service';

const service = new CategoryService();

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace('/api/categories', '') || '/';
  try {
    if (pathname === '/' || pathname === '') {
      const categories = await service.listCategories();
      return NextResponse.json({ success: true, categories });
    }
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0]) {
      const category = await service.getCategory(parts[0]);
      return NextResponse.json({ success: true, category });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
