import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (session) {
    redirect('/admin')
  }

  return <>{children}</>
}

