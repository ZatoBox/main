import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/../backend/auth/service';
import { UserRepository } from '@/../backend/auth/repository';

const service = new AuthService(new UserRepository());

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await service.login(body.email, body.password);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
