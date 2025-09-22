import { NextRequest, NextResponse } from 'next/server';
import { LayoutService } from '@/../backend/back/layout/service';

const service = new LayoutService();

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    const layout = await service.getLayout(slug);
    return NextResponse.json({ success: true, layout });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    const updates = await req.json();
    const updated = await service.updateLayout(slug, updates);
    return NextResponse.json({
      success: true,
      message: 'Layout updated successfully',
      layout: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    const deleted = await service.deleteLayout(slug);
    return NextResponse.json({
      success: true,
      message: 'Layout deleted successfully',
      layout: deleted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
