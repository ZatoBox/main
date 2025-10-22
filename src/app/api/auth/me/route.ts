import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/auth/service';

const service = new AuthService();

function getBearerFromHeader(req: NextRequest): string | undefined {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined;
  return authHeader.split(' ')[1];
}

export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get('zatobox_token')?.value;
    const headerToken = getBearerFromHeader(req);
    const token = cookieToken || headerToken;
    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const user = await service.verifyToken(token);
    const safeUser = { ...user } as any;
    delete safeUser.password;
    return NextResponse.json(safeUser);
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    const status = /restringido|restricted|premium|admin|Invalid Token/i.test(
      msg
    )
      ? 401
      : 500;
    return NextResponse.json({ message: msg }, { status });
  }
}
