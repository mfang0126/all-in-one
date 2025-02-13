import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const userType = request.cookies.get('userType')?.value;
  const currentPath = request.nextUrl.pathname;

  // API user allowed paths
  const isApiAllowedPath =
    currentPath === '/docs/pronunciation' || currentPath === '/docs' || currentPath === '/login' || currentPath === '/pronunciation';

  // If not logged in and not on login page, redirect to login
  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and on login page, redirect to appropriate page
  if (isLoggedIn && isLoginPage) {
    const redirectUrl = new URL(userType === 'api' ? '/docs/pronunciation' : '/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If API user trying to access restricted paths, redirect to docs/pronunciation
  if (isLoggedIn && userType === 'api' && !isApiAllowedPath) {
    const pronunciationUrl = new URL('/docs/pronunciation', request.url);
    return NextResponse.redirect(pronunciationUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
