'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { createBirdProduct } from '@/lib/actions/birds'
import toast from 'react-hot-toast'

export default function NewBirdProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createBirdProduct(formData)
    setLoading(false)
    if (result.success) {
      toast.success('Bird product created')
      router.push('/admin/birds')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/birds" className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-cyan mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Birds
        </Link>
        <h1 className="text-2xl font-bold font-heading text-brand-white text-left">Add Bird Product</h1>
      </div>

      <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-8 max-w-2xl shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Product Name" name="name" placeholder="e.g., Broiler - 45 Day" required />
            <Input label="Bird Type" name="birdType" placeholder="e.g., Broiler" required />
            <Input label="Age" name="age" placeholder="e.g., 45 days" />
            <Input label="Weight" name="weight" placeholder="e.g., 1.8-2.2 kg" />
            <Input label="Price (ETB)" name="price" type="number" step="0.01" placeholder="0.00" />
            <Input label="Available Quantity" name="availableQuantity" type="number" defaultValue="0" />
            <Input label="Minimum Order" name="minimumOrder" type="number" placeholder="e.g., 50" />
            <Select
              label="Status"
              name="status"
              options={[
                { value: 'AVAILABLE', label: 'Available' },
                { value: 'LIMITED', label: 'Limited' },
                { value: 'SOLD_OUT', label: 'Sold Out' },
                { value: 'UPCOMING', label: 'Upcoming' },
              ]}
            />
          </div>
          <Textarea label="Description" name="description" placeholder="Describe this bird product..." rows={3} />
          <Textarea label="Pickup Information" name="pickupInfo" placeholder="Pickup location and instructions..." rows={2} />
          <Textarea label="Delivery Information" name="deliveryInfo" placeholder="Delivery area and pricing..." rows={2} />

          <div className="flex gap-4 pt-4">
            <Button type="submit" loading={loading} className="rounded-full">Create Product</Button>
            <Link href="/admin/birds"><Button variant="ghost" type="button" className="rounded-full">Cancel</Button></Link>
          </div>
        </form>
      </div>
    </div>
  )
}
