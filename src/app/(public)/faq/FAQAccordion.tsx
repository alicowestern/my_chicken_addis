'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {items.map((faq) => (
        <div
          key={faq.id}
          className="bg-white rounded-xl border border-brand-gray-200 overflow-hidden"
        >
          <button
            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[rgba(79,195,247,0.03)] transition-colors"
          >
            <span className="font-medium text-brand-gray-900 pr-4">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-brand-cyan flex-shrink-0 transition-transform duration-300 ${
                openId === faq.id ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-6 pb-5 text-brand-gray-600 text-sm leading-relaxed border-t border-brand-gray-200">
              <div className="pt-4">{faq.answer}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
