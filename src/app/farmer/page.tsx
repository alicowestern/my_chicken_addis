import { Bird, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FarmerPortalPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mx-auto mb-8">
          <Bird className="w-10 h-10 text-brand-cyan" />
        </div>
        <h1 className="text-3xl font-bold font-heading text-brand-white mb-4 text-center">
          Farmer Portal
        </h1>
        <p className="text-brand-muted text-base leading-relaxed mb-3">
          We&apos;re building a dedicated portal where farmers can track orders, access training materials, and manage their farm operations.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          Coming Soon — Phase 3
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-brand text-brand-dark-deep font-bold rounded-full hover:brightness-110 transition-all text-sm"
          >
            Back to Website
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand-cyan/30 text-brand-cyan font-medium rounded-full hover:bg-brand-cyan/5 transition-all text-sm"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
