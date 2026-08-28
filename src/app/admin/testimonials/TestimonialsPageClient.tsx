'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Edit, Trash2, Quote } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '@/components/ui/DataTable'
import { RowAction } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/actions/content'
import type { PaginatedResult } from '@/lib/actions/utils'

type TestimonialItem = {
  id: string
  farmerName: string
  location: string | null
  content: string
  status: string
  displayDate: Date
  [key: string]: unknown
}

const statusVariant: Record<string, 'success' | 'draft' | 'error'> = {
  PUBLISHED: 'success',
  DRAFT: 'draft',
  ARCHIVED: 'error',
}

export default function TestimonialsPageClient({
  initialData,
}: {
  initialData: PaginatedResult<TestimonialItem>
}) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)

  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [farmerName, setFarmerName] = useState('')
  const [location, setLocation] = useState('')
  const [content, setContent] = useState('')
  const [itemStatus, setItemStatus] = useState('DRAFT')

  const fetchData = (newPage: number, overrides?: { search?: string; status?: string }) => {
    startTransition(async () => {
      const result = await getTestimonials({
        page: newPage, limit: 10,
        search: overrides?.search ?? search,
        status: overrides?.status ?? status,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<TestimonialItem>)
        setPage(newPage)
      }
    })
  }

  const openCreate = () => {
    setFarmerName(''); setLocation(''); setContent(''); setItemStatus('DRAFT')
    setEditingItem(null); setIsCreating(true)
  }

  const openEdit = (item: TestimonialItem) => {
    setFarmerName(item.farmerName); setLocation(item.location || ''); setContent(item.content); setItemStatus(item.status)
    setEditingItem(item); setIsCreating(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const fd = new FormData()
      fd.set('farmerName', farmerName)
      fd.set('location', location)
      fd.set('content', content)
      fd.set('status', itemStatus)

      const result = editingItem
        ? await updateTestimonial(editingItem.id, fd)
        : await createTestimonial(fd)

      if (result.success) {
        toast.success(editingItem ? 'Testimonial updated' : 'Testimonial created')
        setIsCreating(false); setEditingItem(null)
        fetchData(page)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await deleteTestimonial(deleteId)
      if (result.success) {
        toast.success('Testimonial deleted')
        setDeleteId(null)
        fetchData(page)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const statusFilters = ['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED']

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Testimonials</h1>
          <p className="text-brand-muted text-sm">Manage farmer success stories and testimonials</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Testimonial</Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => { setStatus(s); fetchData(1, { status: s }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${status === s
              ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
              : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'
            }`}
          >
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          {
            key: 'farmerName', label: 'Farmer', sortable: true,
            render: (item: TestimonialItem) => (
              <div>
                <p className="font-medium text-brand-white">{item.farmerName}</p>
                {item.location && <p className="text-xs text-brand-muted">{item.location}</p>}
              </div>
            ),
          },
          {
            key: 'content', label: 'Testimonial',
            render: (item: TestimonialItem) => (
              <p className="text-sm text-brand-light-gray max-w-xs truncate italic">&ldquo;{item.content}&rdquo;</p>
            ),
          },
          {
            key: 'status', label: 'Status',
            render: (item: TestimonialItem) => <Badge variant={statusVariant[item.status] || 'draft'}>{item.status}</Badge>,
          },
          {
            key: 'displayDate', label: 'Date',
            render: (item: TestimonialItem) => <span className="text-xs text-brand-muted">{new Date(item.displayDate).toLocaleDateString()}</span>,
          },
        ]}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search testimonials..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        rowActions={(item: TestimonialItem) => (
          <>
            <RowAction label="Edit" icon={<Edit className="w-4 h-4" />} onClick={() => openEdit(item)} />
            <RowAction label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteId(item.id)} variant="danger" />
          </>
        )}
        emptyTitle="No testimonials found"
        emptyDescription="Collect and share farmer success stories."
        emptyAction={<Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Testimonial</Button>}
      />

      <Modal open={isCreating} onClose={() => { setIsCreating(false); setEditingItem(null) }} title={editingItem ? 'Edit Testimonial' : 'New Testimonial'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Farmer Name" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} placeholder="e.g. Abebe Tadesse" />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Debre Berhan" />
          </div>
          <Textarea label="Testimonial Content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} placeholder="What did the farmer say about their experience?" />
          <Select label="Status" value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}
            options={[
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Archived', value: 'ARCHIVED' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => { setIsCreating(false); setEditingItem(null) }}>Cancel</Button>
            <Button onClick={handleSave} loading={isSaving}>{editingItem ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Testimonial" message="This testimonial will be permanently deleted." confirmLabel="Delete" loading={isDeleting} />
    </div>
  )
}
