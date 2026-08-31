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
import { createTrainingCourse } from '@/lib/actions/training'

export default function NewTrainingCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await createTrainingCourse(formData)
      if (result.success) {
        toast.success('Training course created')
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
        <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">New Training Course</h1>
        <p className="text-brand-muted text-sm">Create a new training course for farmers</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 sm:p-8 space-y-6">
        <Input label="Course Name" name="name" required placeholder="e.g. Broiler Management 101" />
        <Textarea label="Description" name="description" rows={4} placeholder="What will farmers learn?" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Category" name="category" placeholder="e.g. Poultry Health, Farm Management" />
          <Input label="Duration" name="duration" placeholder="e.g. 3 days, 2 weeks" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Trainer" name="trainer" placeholder="Instructor name" />
          <Input label="Price (ETB)" name="price" type="number" step="0.01" placeholder="0 = Free" />
          <Input label="Capacity" name="capacity" type="number" placeholder="Max participants" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Location" name="location" placeholder="Training venue" />
          <Select
            label="Status"
            name="status"
            options={[
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Archived', value: 'ARCHIVED' },
            ]}
          />
        </div>

        <Input label="Course Image URL" name="image" type="url" placeholder="https://example.com/training-image.jpg" />

        <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.05)]">
          <Link href="/admin/training">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting}>Create Course</Button>
        </div>
      </form>
    </div>
  )
}
