'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { submitFinancingApplication } from '@/lib/actions/public'
import toast from 'react-hot-toast'

export default function FinancingForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await submitFinancingApplication(formData)

    setLoading(false)
    if (result.success) {
      toast.success('Application submitted successfully!')
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
        <h3 className="text-xl font-bold text-brand-gray-900 mb-2">Application Submitted!</h3>
        <p className="text-brand-gray-500 text-sm">Our finance team will review your application and contact you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" name="applicantName" placeholder="Your full name" required />
        <Input label="Phone" name="applicantPhone" type="tel" placeholder="+251..." required />
        <Input label="Email" name="applicantEmail" type="email" placeholder="your@email.com" />
        <Input label="Your Location" name="applicantLocation" placeholder="e.g., Bole, Addis Ababa" />
        <Input label="Farm Location" name="farmLocation" placeholder="Where is/will be your farm?" />
        <Select label="Experience Level" name="experience" placeholder="Select your experience"
          options={[
            { value: 'Beginner', label: 'Beginner - No experience' },
            { value: '1-2 years', label: '1-2 years' },
            { value: '2-5 years', label: '2-5 years' },
            { value: '5+ years', label: '5+ years' },
          ]}
        />
        <Input label="Current Birds" name="currentBirds" type="number" placeholder="How many birds do you have now?" />
        <Input label="Planned Birds" name="plannedBirds" type="number" placeholder="How many birds do you want?" />
        <Input label="Requested Amount (ETB)" name="requestedAmount" type="number" placeholder="Amount needed" />
        <Input label="Estimated Total Investment (ETB)" name="estimatedInvestment" type="number" placeholder="Total investment estimate" />
        <Select label="Do you have an existing farm?" name="existingFarm"
          options={[
            { value: 'false', label: 'No - Starting new' },
            { value: 'true', label: 'Yes - Expanding' },
          ]}
        />
      </div>
      <Textarea label="Purpose of Financing" name="purpose" placeholder="What will you use the financing for?" rows={3} />
      <Textarea label="Additional Message" name="message" placeholder="Any additional information..." rows={3} />

      <Button type="submit" size="lg" fullWidth loading={loading} className="rounded-full">
        Submit Application
      </Button>
    </form>
  )
}
