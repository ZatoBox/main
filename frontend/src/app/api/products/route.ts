import { NextRequest, NextResponse } from 'next/server';
import { polarAPI } from '@/utils/polar.utils';
import { AuthService } from '@/../backend/auth/service';

async function getCurrentUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing authentication token');
  }

  const token = authHeader.split(' ')[1];
  const authService = new AuthService();

  try {
    const user = await authService.verifyToken(token);
    const profile = await authService.getProfileUser(String(user.id));

    const polarApiKey =
      profile.user?.polar_api_key || process.env.POLAR_ACCESS_TOKEN || '';

    return {
      userId: user.id,
      userEmail: user.email,
      polarApiKey: polarApiKey,
    };
  } catch (error) {
    throw new Error('Invalid authentication');
  }
}

export async function GET(req: NextRequest) {
  try {
    const { polarApiKey } = await getCurrentUser(req);
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');
    const organizationId = url.searchParams.get('organization_id') || undefined;

    if (productId) {
      const product = await polarAPI.getProduct(polarApiKey, productId);
      return NextResponse.json({ success: true, product });
    } else {
      const products = await polarAPI.listProducts(polarApiKey, organizationId);
      return NextResponse.json({ success: true, products });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { polarApiKey } = await getCurrentUser(req);
    const body: any = await req.json();

    const product = await polarAPI.createProduct(polarApiKey, body);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { polarApiKey } = await getCurrentUser(req);
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body: any = await req.json();
    const product = await polarAPI.updateProduct(polarApiKey, productId, body);
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
    const { polarApiKey } = await getCurrentUser(req);
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    await polarAPI.deleteProduct(polarApiKey, productId);
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
