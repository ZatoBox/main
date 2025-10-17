import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/auth/service';
import { UserRepository } from '@/backend/auth/repository';

const service = new AuthService(new UserRepository());

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await service.login(body.email, body.password);
    return NextResponse.json({ success: true, ...res });
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    const status = /restringido|restricted|premium|admin/i.test(msg)
      ? 403
      : 401;
    return NextResponse.json({ success: false, message: msg }, { status });
  }
}
