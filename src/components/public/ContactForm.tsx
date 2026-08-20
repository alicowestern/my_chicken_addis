'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { submitContactForm } from '@/lib/actions/public'
import toast from 'react-hot-toast'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)

    setLoading(false)
    if (result.success) {
      toast.success('Message sent! We\'ll get back to you soon.')
      setSubmitted(true)
    } else {
      toast.error(result.error)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-white mb-2">Message Sent!</h3>
        <p className="text-brand-muted text-sm mb-6">Thank you for contacting us. Our team will respond within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm font-medium text-brand-cyan hover:text-brand-blue transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Full Name" name="name" placeholder="Your full name" required />
      <Input label="Phone" name="phone" type="tel" placeholder="+251..." required />
      <Input label="Email" name="email" type="email" placeholder="your@email.com" />
      <Input label="Subject" name="subject" placeholder="How can we help?" />
      <Textarea label="Message" name="message" placeholder="Tell us more..." required rows={4} />
      <Button type="submit" size="lg" fullWidth loading={loading} className="rounded-full">
        Send Message
      </Button>
    </form>
  )
}
