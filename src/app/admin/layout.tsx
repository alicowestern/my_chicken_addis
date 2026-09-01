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
}

