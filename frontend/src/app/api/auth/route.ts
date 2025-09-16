import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/../backend/auth/service';
import { UserRepository } from '@/../backend/auth/repository';

const service = new AuthService(new UserRepository());

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/api/auth', '') || '/';
    if (pathname === '/login') {
      const body = await req.json();
      const res = await service.login(body.email, body.password);
      return NextResponse.json(res);
    }
    if (pathname === '/register') {
      const body = await req.json();
      const res = await service.register(
        body.full_name,
        body.email,
        body.password,
        body.phone
      );
      return NextResponse.json(res);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/api/auth', '') || '/';
    if (pathname === '/me') {
      const auth = req.headers.get('authorization') || '';
      const token =
        auth.replace('Bearer ', '') || req.headers.get('x-token') || '';
      const user = await service.verifyToken(token);
      return NextResponse.json(user);
    }
    if (pathname === '/users') {
      const res = await service.getListUsers();
      return NextResponse.json(res);
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
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/api/auth', '') || '/';
    if (pathname === '/update-profile-image') {
      const form = await req.formData();
      const file = Array.from(form.values()).find((v) => v instanceof File) as
        | File
        | undefined;
      const auth = req.headers.get('authorization') || '';
      const token =
        auth.replace('Bearer ', '') || req.headers.get('x-token') || '';
      const user = await service.verifyToken(token);
      if (!file)
        return NextResponse.json(
          { success: false, message: 'No file' },
          { status: 400 }
        );
      const res = await service.updateProfileImage(user.id, file);
      return NextResponse.json(res);
    }
    if (pathname === '/update-profile') {
      const auth = req.headers.get('authorization') || '';
      const token =
        auth.replace('Bearer ', '') || req.headers.get('x-token') || '';
      const user = await service.verifyToken(token);
      const body = await req.json();
      const res = await service.updateProfile(user.id, body);
      return NextResponse.json(res);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/api/auth', '') || '/';
    if (pathname === '/delete-profile-image') {
      const auth = req.headers.get('authorization') || '';
      const token =
        auth.replace('Bearer ', '') || req.headers.get('x-token') || '';
      const user = await service.verifyToken(token);
      const res = await service.deleteProfileImage(user.id);
      return NextResponse.json(res);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
