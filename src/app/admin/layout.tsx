import Sidebar from '@/components/admin/Sidebar'
import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const session = await auth()

    if (!session) {
      redirect('/auth/login')
    }

    // Regular farmers shouldn't access admin
    if (session.user?.role === 'FARMER') {
      redirect('/')
    }

    return (
      <div className="flex min-h-screen bg-brand-dark">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {/* Mobile top spacing to account for hamburger button */}
          <div className="lg:hidden h-16" />
          <div className="py-6 px-4 sm:px-6 lg:py-8 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    )
  } catch (error: any) {
    // Next.js redirect() throws an error with a specific message or digest that must be re-thrown
    if (error.message?.includes('NEXT_REDIRECT') || error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
    return (
      <div className="p-10 bg-red-900 text-white rounded-xl m-10 z-50 relative">
        <h1 className="text-2xl font-bold mb-4">CRITICAL SERVER ERROR</h1>
        <p className="font-mono text-sm font-bold">{error.message || String(error)}</p>
        <pre className="mt-4 text-xs overflow-auto bg-black/50 p-4 rounded">{error.stack}</pre>
        <p className="mt-6 text-sm">Please screenshot this and send it to your developer.</p>
      </div>
    )
  }
}

