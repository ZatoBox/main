import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/auth/service';
import { UserRepository } from '@/backend/auth/repository';

const service = new AuthService(new UserRepository());

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await service.register(
      body.full_name,
      body.email,
      body.password || '',
      body.phone
    );
    return NextResponse.json({ success: true, ...res });
  } catch (err: any) {
    const message = String(err?.message ?? err);
    const status = /exists/i.test(message) ? 409 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
