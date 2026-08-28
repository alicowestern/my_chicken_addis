'use client'

import { Phone, MessageCircle } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${COMPANY.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20BA5C] hover:scale-110 transition-all duration-300 animate-pulse-glow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-brand-dark-deep text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 pointer-events-none shadow-card border border-[rgba(255,255,255,0.1)]">
          Chat on WhatsApp
        </span>
      </a>

      {/* Phone */}
      <a
        href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-brand-cyan text-brand-dark-deep rounded-full shadow-lg hover:bg-brand-blue hover:text-white hover:scale-110 transition-all duration-300"
        aria-label="Call us"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-brand-dark-deep text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 pointer-events-none shadow-card border border-[rgba(255,255,255,0.1)]">
          Call Us
        </span>
      </a>
    </div>
  )
}
