'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { ArrowLeft, Pencil, Save, X, Phone, Mail, MapPin, Calendar, Bird, Wheat } from 'lucide-react'
import { updateFarmer } from '@/lib/actions/farmers'
import toast from 'react-hot-toast'

interface FarmerDetailProps {
  farmer: {
    id: string
    farmerId: string
    fullName: string
    phone: string
    email: string | null
    location: string | null
    farmLocation: string | null
    experience: string | null
    farmSize: string | null
    birdCapacity: number | null
    status: string
    registrationDate: Date
    createdAt: Date
    birdOrders?: { id: string; orderNumber: string; status: string; orderDate: Date; totalAmount: unknown }[]
    feedOrders?: { id: string; orderNumber: string; status: string; orderDate: Date; totalAmount: unknown }[]
    trainingRegistrations?: { id: string; attendance: string; registrationDate: Date; course: { name: string } }[]
    financingApplications?: { id: string; applicationNumber: string; status: string; requestedAmount: unknown }[]
  }
}

const statusVariant: Record<string, 'success' | 'info' | 'warning' | 'draft'> = {
  ACTIVE: 'success',
  PROSPECT: 'info',
  INACTIVE: 'warning',
  ARCHIVED: 'draft',
}

export default function FarmerDetailClient({ farmer }: FarmerDetailProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateFarmer(farmer.id, formData)

    setLoading(false)
    if (result.success) {
      toast.success('Farmer updated successfully')
      setEditing(false)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <Link
            href="/admin/farmers"
            className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-cyan mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Farmers
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold font-heading text-brand-white text-left">{farmer.fullName}</h1>
            <Badge variant={statusVariant[farmer.status] || 'draft'}>{farmer.status}</Badge>
          </div>
          <p className="text-brand-muted text-sm mt-1">Farmer ID: {farmer.farmerId}</p>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <Button variant="ghost" onClick={() => setEditing(false)} icon={<X className="w-4 h-4" />} className="rounded-full">
              Cancel
            </Button>
          ) : (
            <Button onClick={() => setEditing(true)} icon={<Pencil className="w-4 h-4" />} className="rounded-full">
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-8 shadow-card">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" name="fullName" defaultValue={farmer.fullName} required />
                  <Input label="Phone" name="phone" defaultValue={farmer.phone} required />
                  <Input label="Email" name="email" type="email" defaultValue={farmer.email || ''} />
                  <Input label="Location" name="location" defaultValue={farmer.location || ''} />
                  <Input label="Farm Location" name="farmLocation" defaultValue={farmer.farmLocation || ''} />
                  <Select
                    label="Experience"
                    name="experience"
                    defaultValue={farmer.experience || ''}
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
                    defaultValue={farmer.farmSize || ''}
                    options={[
                      { value: 'Planning', label: 'Planning' },
                      { value: 'Small', label: 'Small (< 500 birds)' },
                      { value: 'Medium', label: 'Medium (500-2000 birds)' },
                      { value: 'Large', label: 'Large (2000+ birds)' },
                    ]}
                  />
                  <Input label="Bird Capacity" name="birdCapacity" type="number" defaultValue={farmer.birdCapacity || ''} />
                  <Select
                    label="Status"
                    name="status"
                    defaultValue={farmer.status}
                    options={[
                      { value: 'PROSPECT', label: 'Prospect' },
                      { value: 'ACTIVE', label: 'Active' },
                      { value: 'INACTIVE', label: 'Inactive' },
                      { value: 'ARCHIVED', label: 'Archived' },
                    ]}
                  />
                </div>
                <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />} className="rounded-full">
                  Save Changes
                </Button>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={farmer.phone} />
                <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={farmer.email || '—'} />
                <InfoItem icon={<MapPin className="w-4 h-4" />} label="Location" value={farmer.location || '—'} />
                <InfoItem icon={<MapPin className="w-4 h-4" />} label="Farm Location" value={farmer.farmLocation || '—'} />
                <InfoItem label="Experience" value={farmer.experience || '—'} />
                <InfoItem label="Farm Size" value={farmer.farmSize || '—'} />
                <InfoItem icon={<Bird className="w-4 h-4" />} label="Bird Capacity" value={farmer.birdCapacity ? `${farmer.birdCapacity} birds` : '—'} />
                <InfoItem icon={<Calendar className="w-4 h-4" />} label="Registered" value={new Date(farmer.registrationDate).toLocaleDateString()} />
              </div>
            )}
          </div>
        </div>

        {/* Side Panel - Quick Stats */}
        <div className="space-y-6">
          <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 shadow-card">
            <h3 className="text-lg font-bold text-brand-white mb-4">Activity</h3>
            <div className="space-y-4">
              <QuickStat icon={<Bird className="w-4 h-4" />} label="Bird Orders" value={farmer.birdOrders?.length || 0} />
              <QuickStat icon={<Wheat className="w-4 h-4" />} label="Feed Orders" value={farmer.feedOrders?.length || 0} />
              <QuickStat label="Training" value={farmer.trainingRegistrations?.length || 0} />
              <QuickStat label="Financing Apps" value={farmer.financingApplications?.length || 0} />
            </div>
          </div>

          {/* Recent Bird Orders */}
          {farmer.birdOrders && farmer.birdOrders.length > 0 && (
            <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] p-6 shadow-card">
              <h3 className="text-lg font-bold text-brand-white mb-4">Recent Bird Orders</h3>
              <div className="space-y-3">
                {farmer.birdOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between py-2 text-sm hover:text-brand-cyan transition-colors"
                  >
                    <span className="text-brand-light-gray">{order.orderNumber.slice(0, 8)}...</span>
                    <Badge variant={order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'info'}>
                      {order.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string | number }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
        {icon && <span className="text-brand-cyan">{icon}</span>}
        {label}
      </div>
      <p className="text-brand-white">{value}</p>
    </div>
  )
}

function QuickStat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-brand-light-gray">
        {icon && <span className="text-brand-cyan">{icon}</span>}
        {label}
      </div>
      <span className="text-brand-white font-bold">{value}</span>
    </div>
  )
}
