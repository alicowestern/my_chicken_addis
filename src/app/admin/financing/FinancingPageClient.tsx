'use client'

import React, { useState, useTransition } from 'react'
import { DollarSign, User, Phone, Mail, MapPin, Landmark, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '@/components/ui/DataTable'
import { RowAction } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { getFinancingApplications, updateFinancingApplication } from '@/lib/actions/financing'
import type { PaginatedResult } from '@/lib/actions/utils'
import { formatDistanceToNow } from 'date-fns'

type AppItem = {
  id: string
  applicationNumber: string
  applicantName: string | null
  applicantPhone: string | null
  applicantEmail: string | null
  applicantLocation: string | null
  farmLocation: string | null
  experience: string | null
  currentBirds: number | null
  plannedBirds: number | null
  requestedAmount: unknown
  estimatedInvestment: unknown
  purpose: string | null
  farmInfo: string | null
  existingFarm: boolean
  message: string | null
  status: string
  notes: string | null
  assignedOfficerId: string | null
  assignedOfficer: { name: string; email: string } | null
  partner: { name: string } | null
  farmer: { fullName: string; farmerId: string; phone: string } | null
  createdAt: Date
  [key: string]: unknown
}

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft' | 'pending'> = {
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  DOCUMENTS_REQUIRED: 'pending',
  REFERRED: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'draft',
  COMPLETED: 'success',
}

export default function FinancingPageClient({
  initialData,
  officers,
}: {
  initialData: PaginatedResult<AppItem>
  officers: { id: string; name: string }[]
}) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editOfficer, setEditOfficer] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = (newPage: number, overrides?: { search?: string; status?: string }) => {
    startTransition(async () => {
      const result = await getFinancingApplications({
        page: newPage, limit: 10,
        search: overrides?.search ?? search,
        status: overrides?.status ?? status,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<AppItem>)
        setPage(newPage)
      }
    })
  }

  const openApp = (app: AppItem) => {
    setSelectedApp(app)
    setEditStatus(app.status)
    setEditNotes(app.notes || '')
    setEditOfficer(app.assignedOfficerId || '')
  }

  const handleUpdate = async () => {
    if (!selectedApp) return
    setIsSaving(true)
    try {
      const fd = new FormData()
      fd.set('status', editStatus)
      fd.set('notes', editNotes)
      fd.set('assignedOfficerId', editOfficer)
      const result = await updateFinancingApplication(selectedApp.id, fd)
      if (result.success) {
        toast.success('Application updated')
        setSelectedApp(null)
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

  const statusFilters = ['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 'REFERRED', 'APPROVED', 'REJECTED', 'CANCELLED']

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Financing Applications</h1>
        <p className="text-brand-muted text-sm">Review and manage farmer financing applications</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => { setStatus(s); fetchData(1, { status: s }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${status === s
              ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
              : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          {
            key: 'applicationNumber', label: 'App #',
            render: (item: AppItem) => <span className="font-mono text-brand-cyan text-xs">{item.applicationNumber.slice(0, 10)}...</span>,
          },
          {
            key: 'applicantName', label: 'Applicant', sortable: true,
            render: (item: AppItem) => (
              <div>
                <p className="font-medium text-brand-white">{item.farmer?.fullName || item.applicantName || '—'}</p>
                {item.applicantPhone && <p className="text-xs text-brand-muted">{item.applicantPhone}</p>}
              </div>
            ),
          },
          {
            key: 'requestedAmount', label: 'Amount',
            render: (item: AppItem) => (
              <span className="text-sm font-medium text-brand-white">
                {item.requestedAmount ? `${Number(item.requestedAmount).toLocaleString()} ETB` : '—'}
              </span>
            ),
          },
          {
            key: 'assignedOfficer', label: 'Officer',
            render: (item: AppItem) => <span className="text-xs">{item.assignedOfficer?.name || '—'}</span>,
          },
          {
            key: 'status', label: 'Status', sortable: true,
            render: (item: AppItem) => <Badge variant={statusVariant[item.status] || 'draft'}>{item.status.replace('_', ' ')}</Badge>,
          },
          {
            key: 'createdAt', label: 'Applied', sortable: true,
            render: (item: AppItem) => <span className="text-xs text-brand-muted">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>,
          },
        ]}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search by app #, name, phone..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        onRowClick={openApp}
        emptyTitle="No applications found"
        emptyDescription="No financing applications match your criteria."
      />

      {/* Application Detail Modal */}
      <Modal open={!!selectedApp} onClose={() => setSelectedApp(null)} title="Financing Application" size="xl">
        {selectedApp && (
          <div className="space-y-6">
            {/* Applicant Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3"><User className="w-4 h-4 text-brand-cyan" /><span className="text-brand-white">{selectedApp.applicantName}</span></div>
              {selectedApp.applicantPhone && <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-cyan" /><a href={`tel:${selectedApp.applicantPhone}`} className="text-brand-cyan hover:underline">{selectedApp.applicantPhone}</a></div>}
              {selectedApp.applicantEmail && <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-cyan" /><span className="text-brand-light-gray">{selectedApp.applicantEmail}</span></div>}
              {selectedApp.applicantLocation && <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-brand-cyan" /><span className="text-brand-light-gray">{selectedApp.applicantLocation}</span></div>}
            </div>

            {/* Financing Details */}
            <div className="bg-brand-dark rounded-lg p-4 border border-[rgba(255,255,255,0.05)]">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Financial Details</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-brand-muted text-xs">Requested Amount</p>
                  <p className="text-brand-white font-medium">{selectedApp.requestedAmount ? `${Number(selectedApp.requestedAmount).toLocaleString()} ETB` : '—'}</p>
                </div>
                <div>
                  <p className="text-brand-muted text-xs">Est. Investment</p>
                  <p className="text-brand-white font-medium">{selectedApp.estimatedInvestment ? `${Number(selectedApp.estimatedInvestment).toLocaleString()} ETB` : '—'}</p>
                </div>
                <div>
                  <p className="text-brand-muted text-xs">Current Birds</p>
                  <p className="text-brand-white font-medium">{selectedApp.currentBirds ?? '—'}</p>
                </div>
                <div>
                  <p className="text-brand-muted text-xs">Planned Birds</p>
                  <p className="text-brand-white font-medium">{selectedApp.plannedBirds ?? '—'}</p>
                </div>
              </div>
            </div>

            {/* Farm & Purpose */}
            {(selectedApp.purpose || selectedApp.farmInfo || selectedApp.message) && (
              <div className="bg-brand-dark rounded-lg p-4 border border-[rgba(255,255,255,0.05)] space-y-3">
                {selectedApp.purpose && (
                  <div><p className="text-xs text-brand-muted mb-1">Purpose</p><p className="text-sm text-brand-light-gray">{selectedApp.purpose}</p></div>
                )}
                {selectedApp.farmInfo && (
                  <div><p className="text-xs text-brand-muted mb-1">Farm Info</p><p className="text-sm text-brand-light-gray">{selectedApp.farmInfo}</p></div>
                )}
                {selectedApp.message && (
                  <div><p className="text-xs text-brand-muted mb-1">Message</p><p className="text-sm text-brand-light-gray whitespace-pre-wrap">{selectedApp.message}</p></div>
                )}
              </div>
            )}

            {/* Update Form */}
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Status" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                  options={[
                    { label: 'Submitted', value: 'SUBMITTED' },
                    { label: 'Under Review', value: 'UNDER_REVIEW' },
                    { label: 'Documents Required', value: 'DOCUMENTS_REQUIRED' },
                    { label: 'Referred', value: 'REFERRED' },
                    { label: 'Approved', value: 'APPROVED' },
                    { label: 'Rejected', value: 'REJECTED' },
                    { label: 'Cancelled', value: 'CANCELLED' },
                    { label: 'Completed', value: 'COMPLETED' },
                  ]}
                />
                <Select label="Assigned Officer" value={editOfficer} onChange={(e) => setEditOfficer(e.target.value)}
                  options={[
                    { label: 'Unassigned', value: '' },
                    ...officers.map((o) => ({ label: o.name, value: o.id })),
                  ]}
                />
              </div>
              <Textarea label="Internal Notes" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} placeholder="Add review notes..." />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedApp(null)}>Cancel</Button>
                <Button onClick={handleUpdate} loading={isSaving}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
