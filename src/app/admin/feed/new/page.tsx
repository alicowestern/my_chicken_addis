'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { createFeedProduct } from '@/lib/actions/feed'
import toast from 'react-hot-toast'

export default function NewFeedProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createFeedProduct(formData)
    setLoading(false)
    if (result.success) { toast.success('Feed product created'); router.push('/admin/feed') }
    else toast.error(result.error)
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/feed" className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-cyan mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Feed
        </Link>
        <h1 className="text-2xl font-bold font-heading text-brand-white text-left">Add Feed Product</h1>
      </div>

      <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-8 max-w-2xl shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Product Name" name="name" placeholder="e.g., Starter Feed" required />
            <Select label="Category" name="category" required options={[
              { value: 'STARTER', label: 'Starter' },
              { value: 'GROWER', label: 'Grower' },
              { value: 'FINISHER', label: 'Finisher' },
              { value: 'LAYER', label: 'Layer' },
              { value: 'OTHER_INPUTS', label: 'Other Inputs' },
            ]} />
            <Input label="Suitable Stage" name="suitableStage" placeholder="e.g., 0-14 days" />
            <Input label="Package Size" name="packageSize" placeholder="e.g., 50 kg" />
            <Input label="Purchase Price (ETB)" name="purchasePrice" type="number" step="0.01" placeholder="0.00" />
            <Input label="Selling Price (ETB)" name="sellingPrice" type="number" step="0.01" placeholder="0.00" />
            <Input label="Stock Quantity" name="stockQuantity" type="number" defaultValue="0" />
            <Input label="Reorder Level" name="reorderLevel" type="number" defaultValue="10" />
            <Input label="Supplier" name="supplier" placeholder="Supplier name" />
            <Select label="Status" name="status" options={[
              { value: 'AVAILABLE', label: 'Available' },
              { value: 'LOW_STOCK', label: 'Low Stock' },
              { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
              { value: 'DISCONTINUED', label: 'Discontinued' },
            ]} />
          </div>
          <Textarea label="Description" name="description" placeholder="Describe this feed product..." rows={3} />
          <div className="flex gap-4 pt-4">
            <Button type="submit" loading={loading} className="rounded-full">Create Product</Button>
            <Link href="/admin/feed"><Button variant="ghost" type="button" className="rounded-full">Cancel</Button></Link>
          </div>
        </form>
      </div>
    </div>
  )
}
