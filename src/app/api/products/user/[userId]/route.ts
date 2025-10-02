import { NextRequest, NextResponse } from 'next/server';
import { polarAPI } from '@/utils/polar.utils';
import { AuthService } from '@/../backend/auth/service';

interface RouteParams {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const authService = new AuthService();
    const userProfile = await authService.getProfileUser(userId);

    if (!userProfile.success || !userProfile.user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const polarApiKey = userProfile.user.polar_api_key;
    const polarOrganizationId = userProfile.user.polar_organization_id;

    if (!polarApiKey) {
      return NextResponse.json(
        { success: false, message: 'User has no Polar API key configured' },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const organizationId =
      url.searchParams.get('organization_id') ||
      polarOrganizationId ||
      undefined;

    const includeArchived = url.searchParams.get('include_archived') === 'true';
    const products = await polarAPI.listProducts(polarApiKey, organizationId, {
      includeArchived,
    });
    const filteredProducts = products.filter(
      (product) =>
        !product.name ||
        (!product.name.startsWith('Order #') &&
          !product.name.startsWith('Cash Order #'))
    );

    return NextResponse.json({
      success: true,
      products: filteredProducts,
      user_id: userId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user products',
      },
      { status: 500 }
    );
  }
}
