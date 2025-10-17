import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/auth/service';

const service = new AuthService();

async function getBearerToken(req: NextRequest) {
  const header = req.headers.get('authorization') || '';
  if (!header) return null;
  const parts = header.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer')
    return parts[1];
  return header;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getBearerToken(req);
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 401 }
      );
    const user = await service.verifyToken(token);
    const out = await service.getProfileUser(String(user.id));
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: String(e?.message ?? e) },
      { status: 401 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getBearerToken(req);
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 401 }
      );
    const user = await service.verifyToken(token);
    const body = await req.json();
    const res = await service.updateProfile(String(user.id), body || {});
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getBearerToken(req);
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 401 }
      );
    const user = await service.verifyToken(token);
    const res = await service.deleteUser(String(user.id));
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
