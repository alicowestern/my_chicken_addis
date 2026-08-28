'use client'

import Button from '@/components/ui/Button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-brand-white mb-3">
          Something went wrong
        </h2>
        <p className="text-brand-muted text-sm mb-6">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-3 bg-brand-dark rounded-lg border border-[rgba(255,255,255,0.05)] text-left">
            <p className="text-xs text-error font-mono break-all">{error.message}</p>
          </div>
        )}
        <Button
          onClick={reset}
          icon={<RotateCcw className="w-4 h-4" />}
          className="rounded-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}
