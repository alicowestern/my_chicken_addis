'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
      } else {
        toast.success('Logged in successfully')
        router.push('/admin')
        router.refresh()
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark-deep flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,195,247,0.1)_0%,transparent_50%)]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-cyan mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Website
        </Link>
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="block text-3xl font-bold text-brand-white font-heading leading-none">
              my chicken
            </span>
            <span className="block text-sm font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none">
              addis
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-brand-white font-heading">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Access the farmer platform and admin dashboard
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-brand-surface py-8 px-4 shadow-card border border-[rgba(255,255,255,0.05)] sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-brand-cyan hover:text-brand-blue">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="rounded-full"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(255,255,255,0.1)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-brand-surface px-2 text-brand-muted">
                  New to My Chicken Addis?
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-brand-light-gray">
                Registration is currently open for active farmers only.{' '}
                <Link href="/contact" className="font-medium text-brand-cyan hover:text-brand-blue">
                  Contact us
                </Link>{' '}
                to join.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
