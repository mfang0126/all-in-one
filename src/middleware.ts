import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define protected routes and their access rules
const protectedRoutes = {
  // Routes that only admin users can access
  adminRoutes: ['/admin', '/settings'],
  // Routes that API users can access
  apiUserRoutes: ['/docs/pronunciation', '/docs', '/pronunciation'],
  // Routes that are public (no auth required)
  publicRoutes: ['/login', '/api/auth/error']
};

// NextAuth augments the Request type with nextauth property
const middleware = withAuth(
  function middleware(request) {
    // const { token } = request.nextauth;
    // const userType = token?.user?.type;
    // const currentPath = request.nextUrl.pathname;

    // // Handle redirects based on user type and current path

    // // 1. If user is on login page but already authenticated, redirect to appropriate home
    // if (currentPath === '/login') {
    //   const redirectUrl = new URL(userType === 'api' ? '/docs/pronunciation' : '/', request.url);
    //   return NextResponse.redirect(redirectUrl);
    // }

    // // 2. If API user is trying to access admin-only routes, redirect to their allowed area
    // if (userType === 'api' && !protectedRoutes.apiUserRoutes.some((route) => currentPath.startsWith(route))) {
    //   const pronunciationUrl = new URL('/docs/pronunciation', request.url);
    //   return NextResponse.redirect(pronunciationUrl);
    // }

    // 3. Allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return true;

        const path = req.nextUrl.pathname;

        // Public routes are always accessible
        if (protectedRoutes.publicRoutes.some((route) => path.startsWith(route))) {
          return true;
        }

        // For protected routes, check if user has a valid token with ID
        const hasValidUserId = !!token?.user?.id;

        // If user is not authenticated, they can't access protected routes
        if (!hasValidUserId) {
          return false;
        }

        // Additional role-based authorization checks
        const userType = token.user?.type;

        // If trying to access admin routes, verify user is not an API user
        if (protectedRoutes.adminRoutes.some((route) => path.startsWith(route))) {
          return userType !== 'api';
        }

        // All other cases: user is authenticated and authorized
        return true;
      }
    },
    pages: {
      signIn: '/login',
      error: '/api/auth/error'
    }
  }
);

export const config = {
  matcher: [
    // Match all paths except those that start with:
    '/((?!api/auth|_next/static|_next/image|favicon.ico|swagger.yml).*)'
  ]
};

export default middleware;
