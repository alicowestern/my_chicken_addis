'use client'

import { Phone, MessageCircle } from 'lucide-react'

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href="https://wa.me/[WHATSAPP_NUMBER]"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-elevated hover:bg-green-600 hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
          Chat on WhatsApp
        </span>
      </a>

      {/* Phone */}
      <a
        href="tel:[COMPANY_PHONE]"
        className="group flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-elevated hover:bg-primary-700 hover:scale-110 transition-all duration-300"
        aria-label="Call us"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200">
          Call Us
        </span>
      </a>
    </div>
  )
}
