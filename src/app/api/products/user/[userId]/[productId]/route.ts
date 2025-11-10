import { NextRequest, NextResponse } from 'next/server';

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

    return NextResponse.json({
      success: true,
      product: null,
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
