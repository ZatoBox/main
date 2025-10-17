import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/backend/back/product/service';
import { AuthService } from '@/backend/auth/service';
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from '@/backend/back/product/models';

async function getCurrentUserId(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing authentication token');
  }
  const token = authHeader.split(' ')[1];
  const authService = new AuthService();
  const user = await authService.verifyToken(token);
  return user.id;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');
    const includeInactive = url.searchParams.get('include_inactive') === 'true';

    const productService = new ProductService();

    if (productId) {
      const product = await productService.getProduct(productId);
      return NextResponse.json({ success: true, product });
    }

    const products = await productService.listProducts(userId, includeInactive);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    const body: CreateProductRequest = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'name is required' },
        { status: 400 }
      );
    }

    if (body.price === undefined || body.price < 0) {
      return NextResponse.json(
        { success: false, message: 'valid price is required' },
        { status: 400 }
      );
    }

    if (body.stock === undefined || body.stock < 0) {
      return NextResponse.json(
        { success: false, message: 'valid stock is required' },
        { status: 400 }
      );
    }

    const productService = new ProductService();
    const product = await productService.createProduct(body, userId);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await getCurrentUserId(req);
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body: UpdateProductRequest = await req.json();
    const productService = new ProductService();
    const product = await productService.updateProduct(productId, body);

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await getCurrentUserId(req);
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productService = new ProductService();
    await productService.deleteProduct(productId);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
