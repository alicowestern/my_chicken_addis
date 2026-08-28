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
    <div className="min-h-screen bg-brand-dark-deep flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,195,247,0.15)_0%,transparent_50%)]" />

      <div className="w-full max-w-lg relative z-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-cyan mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Website
        </Link>
        
        <div className="bg-brand-surface/80 backdrop-blur-xl py-10 px-8 shadow-2xl border border-[rgba(255,255,255,0.08)] rounded-2xl">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-4">
              <span className="block text-3xl font-bold text-brand-white font-heading leading-none">
                My Chicken
              </span>
              <span className="block text-sm font-bold text-brand-cyan tracking-[0.2em] uppercase mt-1 leading-none">
                Addis
              </span>
            </Link>
            <h2 className="text-xl font-bold tracking-tight text-brand-white font-heading mt-4">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-brand-muted">
              Sign in to manage your platform
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              placeholder="admin@mychickenaddis.com"
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
                <a href="#" className="font-medium text-brand-cyan hover:text-brand-blue transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="rounded-full shadow-[0_0_20px_rgba(79,195,247,0.3)] hover:shadow-[0_0_25px_rgba(79,195,247,0.5)] transition-shadow"
            >
              Sign in to Dashboard
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)] text-center">
            <p className="text-xs text-brand-light-gray">
              Secure access restricted to authorized administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
