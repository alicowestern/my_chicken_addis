import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // We can't use Prisma in authorize inside the edge runtime if we use this config in middleware.
      // But NextAuth allows authorize to be here. We just won't call signIn from edge.
      authorize: async () => null, 
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hour expiration
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as any
      }
      return session
    },
  },
} satisfies NextAuthConfig
