import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold font-heading text-gradient-brand mb-6">
          404
        </p>
        <h2 className="text-2xl font-bold font-heading text-brand-white mb-3">
          Page Not Found
        </h2>
        <p className="text-brand-muted text-sm mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/admin">
          <Button
            icon={<ArrowLeft className="w-4 h-4" />}
            className="rounded-full"
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
