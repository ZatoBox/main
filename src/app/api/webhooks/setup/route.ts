import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'Webhook setup not available',
    },
    { status: 501 }
  );
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'Webhook list not available',
    },
    { status: 501 }
  );
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'Webhook delete not available',
    },
    { status: 501 }
  );
}
