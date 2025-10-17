import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'Polar checkout is not available',
    },
    { status: 501 }
  );
}
