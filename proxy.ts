import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the request is for protected routes
  if (
    pathname.startsWith('/student/settings') ||
    pathname === '/student/courses'
  ) {
    // Check if authentication cookie is present
    const authCookie = request.cookies.get('rf');

    if (!authCookie) {
      // Redirect to home page if cookie is not present
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/settings',
    '/student/courses',
    '/student/settings/:path*',
  ],
};
