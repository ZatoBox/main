import { NextRequest, NextResponse } from 'next/server';

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

    return NextResponse.json({
      success: true,
      products: [],
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
