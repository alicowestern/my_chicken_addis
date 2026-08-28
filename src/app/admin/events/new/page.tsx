'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { createEvent } from '@/lib/actions/events'

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await createEvent(formData)
      if (result.success) {
        toast.success('Event created successfully')
        router.push('/admin/events')
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-cyan transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
        <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Create Event</h1>
        <p className="text-brand-muted text-sm">Add a new community event, workshop, or gathering</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 sm:p-8 space-y-6">
        <Input label="Event Title" name="title" required placeholder="e.g. Poultry Farming Workshop" />
        <Textarea label="Description" name="description" rows={4} placeholder="Describe the event..." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Event Type" name="eventType" placeholder="e.g. Workshop, Seminar, Open Day" />
          <Input label="Date" name="date" type="date" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Start Time" name="startTime" placeholder="e.g. 9:00 AM" />
          <Input label="End Time" name="endTime" placeholder="e.g. 5:00 PM" />
          <Select
            label="Status"
            name="status"
            options={[
              { label: 'Upcoming', value: 'UPCOMING' },
              { label: 'Ongoing', value: 'ONGOING' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Cancelled', value: 'CANCELLED' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Location" name="location" placeholder="e.g. Addis Ababa, Ethiopia" />
          <Input label="Organizer" name="organizer" placeholder="e.g. My Chicken Addis" />
        </div>

        <Input label="Featured Image URL" name="featuredImage" placeholder="https://..." />

        <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.05)]">
          <Link href="/admin/events">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting}>Create Event</Button>
        </div>
      </form>
    </div>
  )
}
