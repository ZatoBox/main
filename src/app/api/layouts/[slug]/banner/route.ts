import { NextRequest, NextResponse } from 'next/server';
import {
  uploadImageFromBase64,
  uploadImageToCloudinary,
} from '@/utils/cloudinary';
import { LayoutService } from '@/../backend/back/layout/service';

const service = new LayoutService();

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Missing layout slug' },
        { status: 400 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('file') as File | null;
      const base64 =
        (form.get('base64') as string | null) ||
        (form.get('image') as string | null);

      if (file) {
        imageUrl = await uploadImageToCloudinary(file, 'banners');
      } else if (typeof base64 === 'string' && base64) {
        imageUrl = await uploadImageFromBase64(base64, 'banners');
      } else {
        return NextResponse.json(
          { success: false, message: 'Missing file or base64 image' },
          { status: 400 }
        );
      }
    } else {
      const body = await req.json().catch(() => null);
      const base64 = body?.base64 || body?.image || '';
      if (typeof base64 !== 'string' || !base64) {
        return NextResponse.json(
          { success: false, message: 'Expected JSON with base64 or image' },
          { status: 400 }
        );
      }
      imageUrl = await uploadImageFromBase64(base64, 'banners');
    }

    const updated = await service.updateLayout(slug, { banner: imageUrl });

    return NextResponse.json({
      success: true,
      message: 'Banner updated',
      banner: imageUrl,
      layout: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
