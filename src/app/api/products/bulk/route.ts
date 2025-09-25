import { NextRequest, NextResponse } from 'next/server';
import { polarAPI } from '@/utils/polar.utils';
import { AuthService } from '@/../backend/auth/service';
import { cookies } from 'next/headers';

function getBearerFromHeader(req: NextRequest): string | undefined {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined;
  return authHeader.split(' ')[1];
}

async function getCurrentUser(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get('zatobox_token')?.value;
  const headerToken = getBearerFromHeader(req);
  const authToken = cookieToken || headerToken;
  if (!authToken) throw new Error('Missing authentication token');

  const authService = new AuthService();
  const user = await authService.verifyToken(authToken);
  const profile = await authService.getProfileUser(String(user.id));
  const polarApiKey = profile.user?.polar_api_key || '';
  if (!polarApiKey) throw new Error('Missing Polar API key for user');

  return {
    userId: user.id,
    userEmail: user.email,
    polarApiKey,
    polarOrganizationId: profile.user?.polar_organization_id || '',
  };
}

export async function POST(req: NextRequest) {
  try {
    const { polarApiKey } = await getCurrentUser(req);
    const { products } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No products provided' },
        { status: 400 }
      );
    }

    const createdProducts = [];
    const errors = [];

    for (const productData of products) {
      try {
        if (!productData.name || !productData.name.trim()) {
          errors.push({
            error: 'Product name is required',
            data: { name: productData.name },
          });
          continue;
        }

        if (
          !productData.prices ||
          !Array.isArray(productData.prices) ||
          productData.prices.length === 0
        ) {
          errors.push({
            error: 'Product prices are required',
            data: { name: productData.name },
          });
          continue;
        }

        const product = await polarAPI.createProduct(polarApiKey, {
          name: productData.name.trim(),
          description: productData.description || '',
          recurring_interval: productData.recurring_interval || null,
          prices: productData.prices,
          metadata: productData.metadata || {},
        });

        createdProducts.push({
          id: product.id,
          name: product.name,
          polar_id: product.id,
        });
      } catch (error: any) {
        errors.push({
          error: error.message || 'Failed to create product',
          data: { name: productData.name },
        });
      }
    }

    const success = createdProducts.length > 0;
    const message = success
      ? `Successfully created ${createdProducts.length} products${
          errors.length ? ` (${errors.length} failed)` : ''
        }`
      : 'Failed to create any products';

    return NextResponse.json({
      success,
      message,
      created: createdProducts.length,
      errors: errors.length,
      products: createdProducts,
      failed: errors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create products' },
      { status: 500 }
    );
  }
}
