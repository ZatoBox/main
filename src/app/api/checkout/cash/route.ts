import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: false,
        message: 'Cash checkout is not available',
      },
      { status: 501 }
    );
  } catch (error: any) {
    console.error('Cash checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create cash order',
      },
      { status: 500 }
    );
  }
}
