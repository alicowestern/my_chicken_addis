import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'

const { auth } = NextAuth(authConfig)

const adminRoutes = ['/admin']
const financeRoutes = ['/admin/financing']
const trainingRoutes = ['/admin/training']
const contentRoutes = ['/admin/blog', '/admin/events', '/admin/gallery', '/admin/testimonials', '/admin/faqs']
const authRoutes = ['/auth/login', '/auth/register']

export default auth((request) => {
  const { pathname } = request.nextUrl

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Try to get the session from NextAuth
  const session = request.auth

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && session) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (isAdminRoute) {
    if (!session) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const userRole = session.user?.role

    // Role-based access control
    if (financeRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'SUPER_ADMIN' && userRole !== 'FINANCE_OFFICER') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }

    if (trainingRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'SUPER_ADMIN' && userRole !== 'TRAINING_MANAGER') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }

    if (contentRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'SUPER_ADMIN' && userRole !== 'CONTENT_MANAGER') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }

    // Regular farmers shouldn't access admin
    if (userRole === 'FARMER' && pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
  ],
}
