import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LayoutService } from '@/backend/back/layout/service';

const service = new LayoutService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let owner = req.headers.get('x-user-id') || '';
    if (!owner) {
      const cookieStore = await cookies();
      const raw = cookieStore.get('zatobox_user')?.value;
      if (raw) {
        try {
          const u = JSON.parse(raw);
          if (u && typeof u.id === 'string') owner = u.id;
        } catch {}
      }
    }
    if (!owner) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: missing owner id' },
        { status: 401 }
      );
    }
    const layout = await service.createLayout(body, owner);
    return NextResponse.json({
      success: true,
      message: 'Layout created successfully',
      layout,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace('/api/layouts', '') || '/';
  try {
    if (pathname === '/' || pathname === '') {
      const layouts = await service.listLayouts();
      return NextResponse.json({ success: true, layouts });
    }
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'owner' && parts[1]) {
      const layouts = await service.listLayoutsByOwner(parts[1]);
      return NextResponse.json({ success: true, layouts });
    }
    if (parts[0]) {
      const layout = await service.getLayout(parts[0]);
      return NextResponse.json({
        success: true,
        message: 'Layout found',
        layout,
      });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace('/api/layouts', '') || '/';
  const parts = pathname.split('/').filter(Boolean);
  if (!parts[0])
    return NextResponse.json(
      { success: false, message: 'Missing layout slug' },
      { status: 400 }
    );
  try {
    const updates = await req.json();
    const updated = await service.updateLayout(parts[0], updates);
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

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace('/api/layouts', '') || '/';
  const parts = pathname.split('/').filter(Boolean);
  if (!parts[0])
    return NextResponse.json(
      { success: false, message: 'Missing layout slug' },
      { status: 400 }
    );
  try {
    const deleted = await service.deleteLayout(parts[0]);
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
