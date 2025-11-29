import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set(['/', '/login', '/register', '/upgrade']);
const TOKEN_COOKIE = 'zatobox_token';

function isPublic(pathname: string) {
  return PUBLIC_PATHS.has(pathname);
}

export function proxy(request: NextRequest) {
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
  const userRaw = request.cookies.get('zatobox_user')?.value;
  let role: string | undefined;
  let premiumUntil: number | undefined;
  if (userRaw) {
    try {
      const u = JSON.parse(userRaw);
      role = u?.role;
      if (u?.premium_up_to) {
        const t = Date.parse(u.premium_up_to);
        if (!Number.isNaN(t)) premiumUntil = t;
      }
    } catch {}
  }
  const publicRoute = isPublic(pathname);
  if (!publicRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  if (!publicRoute && token) {
    const isAdmin = role === 'admin';
    const isGuest = role === 'guest';
    const isPremium =
      role === 'premium' &&
      typeof premiumUntil === 'number' &&
      premiumUntil > Date.now();
    if (!isAdmin && !isPremium && !isGuest && pathname !== '/upgrade') {
      const url = request.nextUrl.clone();
      url.pathname = '/upgrade';
      return NextResponse.redirect(url);
    }
  }
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    const isAdmin = role === 'admin';
    const isGuest = role === 'guest';
    const isPremium =
      role === 'premium' &&
      typeof premiumUntil === 'number' &&
      premiumUntil > Date.now();
    url.pathname = isAdmin || isPremium || isGuest ? '/home' : '/upgrade';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
