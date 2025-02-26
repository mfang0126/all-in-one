import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Check if user has a valid token AND a valid user ID
  const hasValidUserId = !!token?.user?.id;
  const isLoggedIn = !!token && hasValidUserId;

  const userType = token?.user?.type;
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|swagger.yml).*)']
};
