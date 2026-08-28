'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Badge from '@/components/ui/Badge'
import { updateEvent } from '@/lib/actions/events'
import type { Event, EventRegistration } from '@prisma/client'

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft'> = {
  UPCOMING: 'info',
  ONGOING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
}

const attendanceVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft'> = {
  REGISTERED: 'info',
  CONFIRMED: 'warning',
  ATTENDED: 'success',
  DID_NOT_ATTEND: 'error',
  CANCELLED: 'draft',
}

export default function EditEventClient({
  event,
}: {
  event: Event & { registrations: EventRegistration[] }
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateEvent(event.id, formData)
      if (result.success) {
        toast.success('Event updated successfully')
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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-heading text-brand-white text-left">Edit Event</h1>
          <Badge variant={statusVariant[event.status] || 'draft'}>{event.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 sm:p-8 space-y-6">
          <Input label="Event Title" name="title" required defaultValue={event.title} />
          <Textarea label="Description" name="description" rows={4} defaultValue={event.description || ''} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Event Type" name="eventType" defaultValue={event.eventType || ''} />
            <Input label="Date" name="date" type="date" required defaultValue={new Date(event.date).toISOString().split('T')[0]} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Start Time" name="startTime" defaultValue={event.startTime || ''} />
            <Input label="End Time" name="endTime" defaultValue={event.endTime || ''} />
            <Select
              label="Status"
              name="status"
              defaultValue={event.status}
              options={[
                { label: 'Upcoming', value: 'UPCOMING' },
                { label: 'Ongoing', value: 'ONGOING' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Location" name="location" defaultValue={event.location || ''} />
            <Input label="Organizer" name="organizer" defaultValue={event.organizer || ''} />
          </div>

          <Input label="Featured Image URL" name="featuredImage" defaultValue={event.featuredImage || ''} />

          <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.05)]">
            <Link href="/admin/events">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit" loading={isSubmitting}>Save Changes</Button>
          </div>
        </form>

        {/* Registrations Sidebar */}
        <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-brand-cyan" />
            <h3 className="text-lg font-bold text-brand-white">Registrations ({event.registrations.length})</h3>
          </div>
          {event.registrations.length === 0 ? (
            <p className="text-sm text-brand-muted">No registrations yet.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
              {event.registrations.map((reg) => (
                <div key={reg.id} className="bg-brand-dark rounded-lg p-3 border border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-brand-white">{reg.name}</p>
                    <Badge variant={attendanceVariant[reg.attendance] || 'draft'}>
                      {reg.attendance.replace('_', ' ')}
                    </Badge>
                  </div>
                  {reg.phone && <p className="text-xs text-brand-muted">{reg.phone}</p>}
                  {reg.email && <p className="text-xs text-brand-muted">{reg.email}</p>}
                  {reg.organization && <p className="text-xs text-brand-cyan">{reg.organization}</p>}
                  {reg.participants > 1 && (
                    <p className="text-xs text-brand-muted mt-1">{reg.participants} participants</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
