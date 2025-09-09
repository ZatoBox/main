import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.polar.sh/v1/subscriptions', {
      headers: {
        Authorization: `Bearer ${process.env.POLAR_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Polar API error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch products from Polar' },
      { status: 500 }
    );
  }
}
