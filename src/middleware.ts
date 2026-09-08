import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', req.nextUrl.origin)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return Response.redirect(loginUrl)
    }

    // Block farmers from accessing admin
    const role = (req.auth?.user as any)?.role
    if (role === 'FARMER') {
      return Response.redirect(new URL('/', req.nextUrl.origin))
    }
  }

  // Redirect logged-in users away from login page
  if (pathname.startsWith('/auth/login') && isLoggedIn) {
    return Response.redirect(new URL('/admin', req.nextUrl.origin))
  }
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
  ],
}
