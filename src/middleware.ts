import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected route patterns
const protectedRoutes = ['/admin', '/farmer']
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Get session token from cookies (NextAuth.js v5 cookie names)
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/farmer/:path*',
    '/auth/:path*',
  ],
}
