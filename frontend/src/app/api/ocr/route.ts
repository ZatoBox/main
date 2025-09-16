import { NextRequest, NextResponse } from 'next/server';
import { processImageFile, sendBulk } from '@/../backend/OCR/handlers';

export async function GET() {
  return NextResponse.json({ message: 'ZatoBox OCR API con Gemini' });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace('/api/ocr', '') || '/ocr';

  if (pathname === '/' || pathname === '')
    return NextResponse.json({ message: 'ZatoBox OCR API with Gemini' });

  try {
    if (pathname === '/ocr') {
      const contentType = req.headers.get('content-type') || '';
      if (!contentType.includes('multipart/form-data'))
        return NextResponse.json(
          { detail: 'Content-Type should be multipart/form-data' },
          { status: 400 }
        );
      const form = await req.formData();
      const file = form.get('file') as File | null;
      if (!file)
        return NextResponse.json(
          { detail: 'No file found in form-data' },
          { status: 400 }
        );
      const authHeader = req.headers.get('authorization');
      const result = await processImageFile({
        file,
        authHeader,
        env: process.env,
      });
      return NextResponse.json(result);
    }

    if (pathname === '/bulk') {
      const body = await req.json();
      const authHeader = req.headers.get('authorization');
      const out = await sendBulk({ data: body, authHeader, env: process.env });
      return NextResponse.json(out, { status: out.status });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    if (err?.status === 429)
      return NextResponse.json(
        { detail: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    if (err?.status === 400)
      return NextResponse.json(
        { detail: 'Invalid file type' },
        { status: 400 }
      );
    return NextResponse.json(
      { detail: `Error: ${err?.message ?? String(err)}` },
      { status: 500 }
    );
  }
}
