import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idsInput: unknown[] = Array.isArray(body?.ids) ? body.ids : [];

    if (idsInput.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No product IDs provided',
          results: [],
          errors: [],
        },
        { status: 400 }
      );
    }

    console.log('Archive products requested:', idsInput);

    return NextResponse.json(
      { success: true, results: [], errors: [] },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to archive products',
        results: [],
        errors: [],
      },
      { status: 500 }
    );
  }
}
