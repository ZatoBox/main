import { NextRequest, NextResponse } from 'next/server';
import { polarAPI } from '@/utils/polar.utils';
import { AuthService } from '@/../backend/auth/service';

interface RouteParams {
  params: Promise<{
    userId: string;
    productId: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId, productId } = await params;

    if (!userId || !productId) {
      return NextResponse.json(
        { success: false, message: 'User ID and Product ID are required' },
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

    if (!polarApiKey) {
      return NextResponse.json(
        { success: false, message: 'User has no Polar API key configured' },
        { status: 400 }
      );
    }

    const product = await polarAPI.getProduct(polarApiKey, productId);

    return NextResponse.json({
      success: true,
      product,
      user_id: userId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch user product',
      },
      { status: 500 }
    );
  }
}
