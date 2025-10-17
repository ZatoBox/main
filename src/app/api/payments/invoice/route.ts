import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TOR_GATEWAY_URL =
  process.env.TOR_GATEWAY_INTERNAL_URL || 'http://tor-gateway:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await axios.post(
      `${TOR_GATEWAY_URL}/api/btcpay/invoices`,
      body
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
