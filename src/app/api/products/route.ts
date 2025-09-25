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

    const polarApiKey = profile.user?.polar_api_key || '';
    if (!polarApiKey) {
      throw new Error('Missing Polar API key for user');
    }

    return {
      userId: user.id,
      userEmail: user.email,
      polarApiKey: polarApiKey,
      polarOrganizationId: profile.user?.polar_organization_id || '',
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
    const includeArchived = url.searchParams.get('include_archived') === 'true';

    if (productId) {
      const product = await polarAPI.getProduct(polarApiKey, productId);
      return NextResponse.json({ success: true, product });
    } else {
      const products = await polarAPI.listProducts(
        polarApiKey,
        organizationId,
        {
          includeArchived,
        }
      );
      const filteredProducts = products.filter(
        (product) => !product.name || !product.name.startsWith('Order #')
      );
      return NextResponse.json({ success: true, products: filteredProducts });
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
    const { polarApiKey, polarOrganizationId } = await getCurrentUser(req);
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const name = String(form.get('name') || '');
      const description = String(form.get('description') || '');
      const organizationId = String(polarOrganizationId || '');
      const billing = String(form.get('billing_interval') || 'once');
      const priceStr = String(form.get('price') || '0');
      const stockStr = String(form.get('stock') || '0');
      const file = form.get('image') as File | null;

      if (!name) {
        return NextResponse.json(
          { success: false, message: 'name is required' },
          { status: 400 }
        );
      }

      if (file && file.size > 0) {
        try {
          await polarAPI.uploadFile(
            polarApiKey,
            file,
            organizationId,
            'product_media'
          );
        } catch {}
      }

      const priceAmount = Math.round(Number(priceStr) * 100);
      const isOnce = billing === 'once';
      const prices = [
        {
          amount_type: 'fixed',
          price_currency: 'usd',
          price_amount: priceAmount,
          type: isOnce ? 'one_time' : 'recurring',
          recurring_interval: isOnce ? undefined : billing,
          legacy: false,
          is_archived: false,
        },
      ];

      const product = await polarAPI.createProduct(polarApiKey, {
        name,
        description: description || undefined,
        recurring_interval: isOnce ? null : billing,
        prices,
        metadata: { quantity: Number(stockStr || '0') },
      });
      return NextResponse.json({ success: true, product });
    } else {
      const body: any = await req.json();
      if (!body.name) {
        return NextResponse.json(
          { success: false, message: 'name is required' },
          { status: 400 }
        );
      }
      const prices = Array.isArray(body.prices) ? body.prices : [];
      const product = await polarAPI.createProduct(polarApiKey, {
        name: body.name,
        description: body.description,
        recurring_interval:
          typeof body.recurring_interval === 'string'
            ? body.recurring_interval
            : null,
        prices,
        metadata: body.metadata || {},
      });
      return NextResponse.json({ success: true, product });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    const product = await polarAPI.updateProduct(polarApiKey, productId, {
      is_archived: true,
    });
    return NextResponse.json({
      success: true,
      message: 'Product archived successfully',
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to archive product' },
      { status: 500 }
    );
  }
}
