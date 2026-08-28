'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Badge from '@/components/ui/Badge'
import { updateTrainingCourse } from '@/lib/actions/training'
import type { TrainingCourse, TrainingEvent, TrainingRegistration } from '@prisma/client'

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft'> = {
  ACTIVE: 'success',
  DRAFT: 'draft',
  COMPLETED: 'info',
  ARCHIVED: 'error',
}

const attendanceVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft'> = {
  REGISTERED: 'info',
  CONFIRMED: 'warning',
  ATTENDED: 'success',
  DID_NOT_ATTEND: 'error',
  CANCELLED: 'draft',
}

type CourseDetail = TrainingCourse & {
  events: TrainingEvent[]
  registrations: (TrainingRegistration & { event: TrainingEvent | null })[]
}

export default function TrainingDetailClient({ course }: { course: CourseDetail }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateTrainingCourse(course.id, formData)
      if (result.success) {
        toast.success('Course updated')
        router.push('/admin/training')
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
        <Link href="/admin/training" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-cyan transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Training
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-heading text-brand-white text-left">{course.name}</h1>
          <Badge variant={statusVariant[course.status] || 'draft'}>{course.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 sm:p-8 space-y-6">
          <Input label="Course Name" name="name" required defaultValue={course.name} />
          <Textarea label="Description" name="description" rows={4} defaultValue={course.description || ''} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Category" name="category" defaultValue={course.category || ''} />
            <Input label="Duration" name="duration" defaultValue={course.duration || ''} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Trainer" name="trainer" defaultValue={course.trainer || ''} />
            <Input label="Price (ETB)" name="price" type="number" step="0.01" defaultValue={course.price ? Number(course.price) : ''} />
            <Input label="Capacity" name="capacity" type="number" defaultValue={course.capacity || ''} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Location" name="location" defaultValue={course.location || ''} />
            <Select
              label="Status"
              name="status"
              defaultValue={course.status}
              options={[
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Archived', value: 'ARCHIVED' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.05)]">
            <Link href="/admin/training"><Button variant="ghost" type="button">Cancel</Button></Link>
            <Button type="submit" loading={isSubmitting}>Save Changes</Button>
          </div>
        </form>

        {/* Sidebar: Registrations */}
        <div className="space-y-6">
          {/* Events */}
          <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-lg font-bold text-brand-white">Events ({course.events.length})</h3>
            </div>
            {course.events.length === 0 ? (
              <p className="text-sm text-brand-muted">No events scheduled.</p>
            ) : (
              <div className="space-y-2">
                {course.events.map((evt) => (
                  <div key={evt.id} className="bg-brand-dark rounded-lg p-3 border border-[rgba(255,255,255,0.05)]">
                    <p className="text-sm font-medium text-brand-white">{evt.title || 'Session'}</p>
                    <p className="text-xs text-brand-muted">{new Date(evt.date).toLocaleDateString()}</p>
                    <Badge variant={statusVariant[evt.status] || 'draft'}>{evt.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registrations */}
          <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-brand-cyan" />
              <h3 className="text-lg font-bold text-brand-white">Registrations ({course.registrations.length})</h3>
            </div>
            {course.registrations.length === 0 ? (
              <p className="text-sm text-brand-muted">No registrations yet.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
                {course.registrations.map((reg) => (
                  <div key={reg.id} className="bg-brand-dark rounded-lg p-3 border border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-brand-white">{reg.registrantName || 'Unknown'}</p>
                      <Badge variant={attendanceVariant[reg.attendance] || 'draft'}>{reg.attendance}</Badge>
                    </div>
                    {reg.registrantPhone && <p className="text-xs text-brand-muted">{reg.registrantPhone}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
