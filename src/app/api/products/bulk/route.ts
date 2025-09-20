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
        if (!productData.name) {
          errors.push({ error: 'Product name is required', data: productData });
          continue;
        }

        const product = await polarAPI.createProduct(polarApiKey, {
          name: productData.name,
          description: productData.description || '',
          recurring_interval: null,
          prices: productData.prices || [{
            amount_type: 'fixed',
            price_currency: 'usd',
            price_amount: productData.price_amount || 0
          }],
          metadata: productData.metadata || {}
        });

        createdProducts.push(product);
      } catch (error: any) {
        errors.push({ 
          error: error.message || 'Failed to create product', 
          data: productData 
        });
      }
    }

    return NextResponse.json({
      success: true,
      created: createdProducts.length,
      errors: errors.length,
      products: createdProducts,
      failed: errors
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create products' },
      { status: 500 }
    );
  }
}