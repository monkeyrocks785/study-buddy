import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './src/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;

  // 1. Allow public files and auth APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname === '/login'
  ) {
    if (pathname === '/login' && session) {
      try {
        await decrypt(session);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (e) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 2. Protect everything else (pages and private APIs)
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await decrypt(session);
    return NextResponse.next();
  } catch (e) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/:path*'],
};
