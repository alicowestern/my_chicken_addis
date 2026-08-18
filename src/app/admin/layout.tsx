import Sidebar from '@/components/admin/Sidebar'
import React from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-brand-dark">
      <Sidebar />
      <main className="flex-1">
        <div className="py-8 px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
