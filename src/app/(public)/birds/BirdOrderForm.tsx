'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { Plus, Trash2 } from 'lucide-react'
import { submitBirdOrder } from '@/lib/actions/public'
import toast from 'react-hot-toast'

export interface AvailableBirdProduct {
  id: string
  name: string
  price: unknown
  availableQuantity: number
  minimumOrder: number | null
}

export default function BirdOrderForm({ products }: { products: AvailableBirdProduct[] }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([])

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 50 }])
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    if (field === 'productId') newItems[index].productId = value
    if (field === 'quantity') newItems[index].quantity = parseInt(value, 10) || 0
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Please add at least one product to your order')
      return
    }
    
    // Validate minimum orders
    for (const item of items) {
      if (!item.productId) {
        toast.error('Please select a product for all items')
        return
      }
      const product = products.find(p => p.id === item.productId)
      if (product?.minimumOrder && item.quantity < product.minimumOrder) {
        toast.error(`Minimum order for ${product.name} is ${product.minimumOrder}`)
        return
      }
    }

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    // Add the complex items array as JSON
    formData.append('items', JSON.stringify(items))
    
    const result = await submitBirdOrder(formData)

    setLoading(false)
    if (result.success) {
      toast.success('Order request submitted successfully!')
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
        <h3 className="text-xl font-bold text-brand-white mb-2">Request Received!</h3>
        <p className="text-brand-muted text-sm">We've received your order request. A representative will contact you shortly to confirm availability and payment details.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" name="customerName" placeholder="Your full name" required />
        <Input label="Phone" name="customerPhone" type="tel" placeholder="+251..." required />
        <Input label="Email" name="customerEmail" type="email" placeholder="your@email.com" />
        <Input label="Location" name="customerLocation" placeholder="Delivery/farm location" />
        <Input label="Preferred Date" name="preferredDate" type="date" />
        <Select label="Delivery Method" name="deliveryMethod" options={[
          { value: 'PICKUP', label: 'Farm Pickup' },
          { value: 'DELIVERY', label: 'Delivery' }
        ]} />
      </div>

      {/* Order Items */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-brand-light-gray">Order Items <span className="text-error">*</span></label>
          <Button type="button" size="sm" variant="secondary" onClick={addItem} icon={<Plus className="w-4 h-4" />} className="rounded-full">
            Add Item
          </Button>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl mb-4">
            <p className="text-brand-muted text-sm">No items added to order yet.</p>
            <Button type="button" size="sm" variant="ghost" onClick={addItem} className="mt-2 text-brand-cyan">Add an item</Button>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {items.map((item, index) => {
              const product = products.find(p => p.id === item.productId)
              return (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[rgba(255,255,255,0.02)] p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                  <div className="flex-1 w-full">
                    <Select
                      options={products.map(p => ({ 
                        value: p.id, 
                        label: `${p.name} - ${p.price ? Number(p.price) + ' ETB' : 'Contact for price'}`
                      }))}
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      placeholder="Select product..."
                      required
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      min={product?.minimumOrder || 1}
                      required
                    />
                  </div>
                  <button type="button" onClick={() => removeItem(index)} className="p-3 text-brand-muted hover:text-error transition-colors mt-0 sm:mt-0 self-end sm:self-auto">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Textarea label="Additional Requirements or Questions" name="message" placeholder="Any special instructions..." rows={3} />

      <Button type="submit" size="lg" fullWidth loading={loading} disabled={items.length === 0} className="rounded-full">
        Submit Request
      </Button>
    </form>
  )
}
