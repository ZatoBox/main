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

export async function POST(req: NextRequest) {
  try {
    const token = await getBearerToken(req);
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 401 }
      );
    const user = await service.verifyToken(token);
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file)
      return NextResponse.json(
        { success: false, message: 'Missing file' },
        { status: 400 }
      );
    const res = await service.uploadProfileImage(String(user.id), file);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: String(e?.message ?? e) },
      { status: 500 }
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
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file)
      return NextResponse.json(
        { success: false, message: 'Missing file' },
        { status: 400 }
      );
    const res = await service.updateProfileImage(String(user.id), file);
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
    const res = await service.deleteProfileImage(String(user.id));
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
