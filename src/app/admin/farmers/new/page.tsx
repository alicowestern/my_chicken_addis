'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { createFarmer } from '@/lib/actions/farmers'
import toast from 'react-hot-toast'

export default function NewFarmerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const result = await createFarmer(formData)

    setLoading(false)
    if (result.success) {
      toast.success('Farmer created successfully')
      router.push('/admin/farmers')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/farmers"
          className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-cyan mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Farmers
        </Link>
        <h1 className="text-2xl font-bold font-heading text-brand-white text-left">Add New Farmer</h1>
      </div>

      <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-8 max-w-2xl shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Enter full name"
              required
              error={errors.fullName}
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              placeholder="+251..."
              required
              error={errors.phone}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="farmer@example.com"
              error={errors.email}
            />
            <Input
              label="Location"
              name="location"
              placeholder="e.g., Bole, Addis Ababa"
            />
            <Input
              label="Farm Location"
              name="farmLocation"
              placeholder="e.g., Sendafa"
            />
            <Select
              label="Experience"
              name="experience"
              placeholder="Select experience level"
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: '1-2 years', label: '1-2 years' },
                { value: '2-5 years', label: '2-5 years' },
                { value: '5+ years', label: '5+ years' },
              ]}
            />
            <Select
              label="Farm Size"
              name="farmSize"
              placeholder="Select farm size"
              options={[
                { value: 'Planning', label: 'Planning' },
                { value: 'Small', label: 'Small (< 500 birds)' },
                { value: 'Medium', label: 'Medium (500-2000 birds)' },
                { value: 'Large', label: 'Large (2000+ birds)' },
              ]}
            />
            <Input
              label="Bird Capacity"
              name="birdCapacity"
              type="number"
              placeholder="e.g., 500"
              min={0}
            />
            <Select
              label="Status"
              name="status"
              options={[
                { value: 'PROSPECT', label: 'Prospect' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
              ]}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" loading={loading} className="rounded-full">
              Create Farmer
            </Button>
            <Link href="/admin/farmers">
              <Button variant="ghost" type="button" className="rounded-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
