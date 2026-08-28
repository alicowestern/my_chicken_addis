'use client'

import React, { useState, useTransition } from 'react'
import { MessageSquare, Eye, Trash2, User, Phone, Mail, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '@/components/ui/DataTable'
import { RowAction } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { getLeads, updateLead, deleteLead } from '@/lib/actions/leads'
import type { PaginatedResult } from '@/lib/actions/utils'
import { formatDistanceToNow } from 'date-fns'

type LeadItem = {
  id: string
  name: string
  phone: string | null
  email: string | null
  location: string | null
  type: string
  subject: string | null
  message: string | null
  status: string
  notes: string | null
  assignedStaffId: string | null
  assignedStaff: { name: string; email: string } | null
  birdOrder: { id: string; orderNumber: string; status: string } | null
  createdAt: Date
  updatedAt: Date
  [key: string]: unknown
}

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft'> = {
  NEW: 'info',
  CONTACTED: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  REJECTED: 'error',
  ARCHIVED: 'draft',
}

const typeLabels: Record<string, string> = {
  BIRD_INQUIRY: 'Bird Inquiry',
  FEED_INQUIRY: 'Feed Inquiry',
  TRAINING: 'Training',
  FINANCING: 'Financing',
  GENERAL_CONTACT: 'General Contact',
}

export default function LeadsPageClient({
  initialData,
  staffMembers,
}: {
  initialData: PaginatedResult<LeadItem>
  staffMembers: { id: string; name: string; role: string }[]
}) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [type, setType] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update form state
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editStaff, setEditStaff] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = (newPage: number, overrides?: { search?: string; status?: string; type?: string }) => {
    startTransition(async () => {
      const result = await getLeads({
        page: newPage,
        limit: 10,
        search: overrides?.search ?? search,
        status: overrides?.status ?? status,
        type: overrides?.type ?? type,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<LeadItem>)
        setPage(newPage)
      }
    })
  }

  const openLead = (lead: LeadItem) => {
    setSelectedLead(lead)
    setEditStatus(lead.status)
    setEditNotes(lead.notes || '')
    setEditStaff(lead.assignedStaffId || '')
  }

  const handleUpdate = async () => {
    if (!selectedLead) return
    setIsSaving(true)
    try {
      const fd = new FormData()
      fd.set('status', editStatus)
      fd.set('notes', editNotes)
      fd.set('assignedStaffId', editStaff)
      const result = await updateLead(selectedLead.id, fd)
      if (result.success) {
        toast.success('Lead updated successfully')
        setSelectedLead(null)
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
      const result = await deleteLead(deleteId)
      if (result.success) {
        toast.success('Lead archived successfully')
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

  const statusFilters = ['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'ARCHIVED']
  const typeFilters = ['ALL', 'GENERAL_CONTACT', 'BIRD_INQUIRY', 'FEED_INQUIRY', 'TRAINING', 'FINANCING']

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Leads & Messages</h1>
        <p className="text-brand-muted text-sm">Manage inquiries, contact forms, and customer messages</p>
      </div>

      {/* Type filter pills */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {typeFilters.map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); fetchData(1, { type: t }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${type === t
              ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
              : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'
            }`}
          >
            {t === 'ALL' ? 'All Types' : typeLabels[t] || t}
          </button>
        ))}
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); fetchData(1, { status: s }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${status === s
              ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
              : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'
            }`}
          >
            {s === 'ALL' ? 'All Status' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            label: 'Contact',
            sortable: true,
            render: (item: LeadItem) => (
              <div>
                <p className="font-medium text-brand-white">{item.name}</p>
                {item.phone && <p className="text-xs text-brand-muted">{item.phone}</p>}
              </div>
            ),
          },
          {
            key: 'type',
            label: 'Type',
            render: (item: LeadItem) => (
              <span className="text-xs text-brand-light-gray">{typeLabels[item.type] || item.type}</span>
            ),
          },
          {
            key: 'subject',
            label: 'Subject / Message',
            render: (item: LeadItem) => (
              <div className="max-w-[200px]">
                {item.subject && <p className="text-sm text-brand-white truncate">{item.subject}</p>}
                {item.message && <p className="text-xs text-brand-muted truncate">{item.message}</p>}
              </div>
            ),
          },
          {
            key: 'assignedStaff',
            label: 'Assigned',
            render: (item: LeadItem) => (
              <span className="text-xs text-brand-light-gray">{item.assignedStaff?.name || '—'}</span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: LeadItem) => <Badge variant={statusVariant[item.status] || 'draft'}>{item.status.replace('_', ' ')}</Badge>,
          },
          {
            key: 'createdAt',
            label: 'Received',
            sortable: true,
            render: (item: LeadItem) => (
              <span className="text-xs text-brand-muted">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
            ),
          },
        ]}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search by name, phone, email, subject..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        onRowClick={openLead}
        rowActions={(item: LeadItem) => (
          <>
            <RowAction label="View Details" icon={<Eye className="w-4 h-4" />} onClick={() => openLead(item)} />
            <RowAction label="Archive" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteId(item.id)} variant="danger" />
          </>
        )}
        emptyTitle="No leads found"
        emptyDescription="No leads match your current filters."
      />

      {/* Lead Detail Modal */}
      <Modal
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        description={selectedLead ? `${typeLabels[selectedLead.type] || selectedLead.type} • Received ${formatDistanceToNow(new Date(selectedLead.createdAt), { addSuffix: true })}` : ''}
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span className="text-brand-white">{selectedLead.name}</span>
              </div>
              {selectedLead.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                  <a href={`tel:${selectedLead.phone}`} className="text-brand-cyan hover:underline">{selectedLead.phone}</a>
                </div>
              )}
              {selectedLead.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                  <a href={`mailto:${selectedLead.email}`} className="text-brand-cyan hover:underline">{selectedLead.email}</a>
                </div>
              )}
              {selectedLead.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                  <span className="text-brand-light-gray">{selectedLead.location}</span>
                </div>
              )}
            </div>

            {/* Message */}
            {selectedLead.message && (
              <div className="bg-brand-dark rounded-lg p-4 border border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-brand-cyan" />
                  <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Message</span>
                </div>
                <p className="text-sm text-brand-light-gray whitespace-pre-wrap">{selectedLead.message}</p>
              </div>
            )}

            {/* Related Bird Order */}
            {selectedLead.birdOrder && (
              <div className="bg-brand-dark rounded-lg p-4 border border-[rgba(255,255,255,0.05)]">
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Related Order</p>
                <p className="text-sm text-brand-white">
                  Order #{selectedLead.birdOrder.orderNumber.slice(0, 10)}... •{' '}
                  <Badge variant={statusVariant[selectedLead.birdOrder.status] || 'draft'}>
                    {selectedLead.birdOrder.status}
                  </Badge>
                </p>
              </div>
            )}

            {/* Update Form */}
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  options={[
                    { label: 'New', value: 'NEW' },
                    { label: 'Contacted', value: 'CONTACTED' },
                    { label: 'In Progress', value: 'IN_PROGRESS' },
                    { label: 'Completed', value: 'COMPLETED' },
                    { label: 'Rejected', value: 'REJECTED' },
                    { label: 'Archived', value: 'ARCHIVED' },
                  ]}
                />
                <Select
                  label="Assign to Staff"
                  value={editStaff}
                  onChange={(e) => setEditStaff(e.target.value)}
                  options={[
                    { label: 'Unassigned', value: '' },
                    ...staffMembers.map((s) => ({ label: s.name, value: s.id })),
                  ]}
                />
              </div>
              <Textarea
                label="Internal Notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about this lead..."
                rows={3}
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedLead(null)}>Cancel</Button>
                <Button onClick={handleUpdate} loading={isSaving}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Archive Lead"
        message="This lead will be archived and hidden from the list. You can still find it by filtering archived leads."
        confirmLabel="Archive"
        loading={isDeleting}
      />
    </div>
  )
}
