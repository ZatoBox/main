import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { plan, cycle, userId } = await request.json();

    console.log('Subscription checkout requested:', { plan, cycle, userId });

    return NextResponse.json({ url: '/success' });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
