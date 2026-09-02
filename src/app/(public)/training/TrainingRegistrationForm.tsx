'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { submitTrainingRegistration } from '@/lib/actions/public'
import toast from 'react-hot-toast'

interface Course {
  id: string
  name: string
  events?: { id: string, date: Date, title: string | null }[]
}

export default function TrainingRegistrationForm({ courses }: { courses: Course[] }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState('')

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await submitTrainingRegistration(formData)

    setLoading(false)
    if (result.success) {
      toast.success('Registration submitted successfully!')
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
        <h3 className="text-xl font-bold text-brand-gray-900 mb-2">Registration Received!</h3>
        <p className="text-brand-gray-500 text-sm mb-6">Our training coordinator will contact you shortly to confirm your spot.</p>
        <Button onClick={() => setSubmitted(false)} variant="ghost" className="rounded-full">Register someone else</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Select Course"
        name="courseId"
        options={courses.map((c) => ({ value: c.id, label: c.name }))}
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
        required
      />

      {/* Show sessions if the selected course has them */}
      {selectedCourse?.events && selectedCourse.events.length > 0 && (
        <Select
          label="Preferred Session"
          name="eventId"
          options={selectedCourse.events.map((e) => ({
            value: e.id,
            label: `${new Date(e.date).toLocaleDateString()} - ${e.title}`,
          }))}
          placeholder="I'll wait for the next available schedule"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" name="registrantName" placeholder="Participant's full name" required />
        <Input label="Phone" name="registrantPhone" type="tel" placeholder="+251..." required />
        <Input label="Email" name="registrantEmail" type="email" placeholder="Email address (optional)" />
      </div>

      <Textarea label="Any specific questions or expectations?" name="notes" placeholder="What are you hoping to learn?" rows={3} />

      <Button type="submit" size="lg" fullWidth loading={loading} className="rounded-full">
        Complete Registration
      </Button>
    </form>
  )
}
