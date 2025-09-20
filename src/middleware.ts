import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set(['/', '/login', '/register']);
const TOKEN_COOKIE = 'zatobox_token';

function isPublic(pathname: string) {
  return PUBLIC_PATHS.has(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }
  if (/\.(png|jpg|jpeg|gif|svg|ico|webp|txt|mp4)$/i.test(pathname)) {
    return NextResponse.next();
  }
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const publicRoute = isPublic(pathname);
  if (!publicRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
