import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function PublicNotFound() {
  return (
    <div className="min-h-[60vh] bg-brand-dark flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <p className="text-8xl font-bold font-heading text-gradient-brand mb-6">
          404
        </p>
        <h2 className="text-2xl font-bold font-heading text-brand-white mb-3 text-center">
          Page Not Found
        </h2>
        <p className="text-brand-muted text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button
            icon={<ArrowLeft className="w-4 h-4" />}
            className="rounded-full"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
