'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import { submitEventRegistration } from '@/lib/actions/public'
import toast from 'react-hot-toast'

interface Event {
  id: string
  title: string
  description: string | null
  eventType: string | null
  date: Date
  startTime: string | null
  endTime: string | null
  location: string | null
  organizer: string | null
  status: string
  capacity?: number | null
}

export default function EventsList({ events }: { events: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedEvent) return
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('eventId', selectedEvent.id)
    const result = await submitEventRegistration(formData)

    setLoading(false)
    if (result.success) {
      toast.success('Registration successful!')
      setSelectedEvent(null)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-8 hover:border-brand-cyan/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {event.eventType && <Badge variant="info">{event.eventType}</Badge>}
                  <Badge variant={event.status === 'UPCOMING' ? 'warning' : 'success'}>{event.status}</Badge>
                </div>
                <h3 className="text-xl font-bold text-brand-white mb-3">{event.title}</h3>
                {event.description && (
                  <p className="text-brand-light-gray text-sm leading-relaxed mb-4">{event.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-brand-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-cyan" />
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  {event.startTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-cyan" />
                      {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-cyan" />
                      {event.location}
                    </span>
                  )}
                  {event.capacity && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-cyan" />
                      {event.capacity} spots
                    </span>
                  )}
                </div>
              </div>
              <Button onClick={() => setSelectedEvent(event)} className="rounded-full flex-shrink-0">
                Register
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={`Register for ${selectedEvent?.title}`} size="md">
        <form onSubmit={handleRegister} className="space-y-4">
          <Input label="Full Name" name="name" placeholder="Your full name" required />
          <Input label="Phone" name="phone" type="tel" placeholder="+251..." required />
          <Input label="Email" name="email" type="email" placeholder="your@email.com" />
          <Input label="Organization" name="organization" placeholder="Company or farm name" />
          <Input label="Number of Participants" name="participants" type="number" defaultValue="1" min={1} />
          <Textarea label="Message" name="message" placeholder="Any questions or notes..." rows={2} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => setSelectedEvent(null)} className="rounded-full">Cancel</Button>
            <Button type="submit" loading={loading} className="rounded-full">Register</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
