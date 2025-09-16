import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/../backend/back/product/service';
import { uploadMultipleImagesFromFiles } from '@/utils/cloudinary';

const service = new ProductService();

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/api/products', '') || '/';
    if (pathname === '/' || pathname === '') {
      const body = await req.json();
      const userId = req.headers.get('x-user-id') || '';
      const product = await service.createProduct(body, userId);
      return NextResponse.json({ success: true, product });
    }
    if (pathname === '/bulk') {
      const body = await req.json();
      const userId = req.headers.get('x-user-id') || '';
      const results: any[] = [];
      for (let i = 0; i < body.length; i++) {
        try {
          const p = await service.createProduct(body[i], userId);
          results.push(p);
        } catch (e: any) {
          const errStr = String(e?.message ?? e);
          if (
            errStr.includes('duplicate') ||
            errStr.includes('duplicate key')
          ) {
            try {
              const modified = {
                ...body[i],
                sku: `${body[i].sku || 'sku'}_${i + 1}`,
              };
              const p2 = await service.createProduct(modified, userId);
              results.push(p2);
            } catch (e2) {
              continue;
            }
          } else {
            continue;
          }
        }
      }
      return NextResponse.json(results);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/api/products', '') || '/';
    if (pathname === '/' || pathname === '') {
      const userId = req.headers.get('x-user-id') || '';
      const products = await service.listProducts(userId);
      return NextResponse.json({ success: true, products });
    }
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'active') {
      const userId = req.headers.get('x-user-id') || '';
      const products = await service.listProducts(userId);
      const active = products.filter(
        (p) => String(p.status || '').toLowerCase() === 'active'
      );
      return NextResponse.json({ success: true, products: active });
    }
    if (parts[0]) {
      const product = await service.getProduct(parts[0]);
      return NextResponse.json({
        success: true,
        message: 'Product found',
        product,
      });
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
    const pathname = url.pathname.replace('/api/products', '') || '/';
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0]) {
      const body = await req.json();
      const userTimezone = req.headers.get('x-user-timezone') || 'UTC';
      const updated = await service.updateProduct(parts[0], body, userTimezone);
      return NextResponse.json({
        success: true,
        message: 'Product updated successfully',
        product: updated,
      });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/api/products', '') || '/';
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0]) {
      const deleted = await service.deleteProduct(parts[0]);
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully',
        product: deleted,
      });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function POST_images(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Invalid content type' },
        { status: 400 }
      );
    }
    const form = await req.formData();
    const files: File[] = [];
    for (const [key, value] of form.entries()) {
      if (value instanceof File) files.push(value as File);
    }
    if (files.length === 0)
      return NextResponse.json(
        { success: false, message: 'No files provided' },
        { status: 400 }
      );
    const urls = await uploadMultipleImagesFromFiles(files);
    return NextResponse.json({ success: true, urls });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
