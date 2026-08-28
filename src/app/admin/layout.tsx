import Sidebar from '@/components/admin/Sidebar'
import React from 'react'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
