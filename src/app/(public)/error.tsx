'use client'

import Button from '@/components/ui/Button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] bg-brand-dark flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-brand-white mb-3 text-center">
          Something went wrong
        </h2>
        <p className="text-brand-muted text-sm mb-6">
          We encountered an unexpected error. Please try again.
        </p>
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
