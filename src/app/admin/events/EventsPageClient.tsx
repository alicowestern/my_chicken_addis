'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '@/components/ui/DataTable'
import { RowAction } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import { getEvents, deleteEvent } from '@/lib/actions/events'
import type { PaginatedResult } from '@/lib/actions/utils'

type EventItem = {
  id: string
  title: string
  slug: string
  eventType: string | null
  date: Date
  startTime: string | null
  endTime: string | null
  location: string | null
  status: string
  _count: { registrations: number }
  [key: string]: unknown
}

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft'> = {
  UPCOMING: 'info',
  ONGOING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
}

export default function EventsPageClient({
  initialData,
}: {
  initialData: PaginatedResult<EventItem>
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = (newPage: number, overrides?: { search?: string; status?: string }) => {
    startTransition(async () => {
      const result = await getEvents({
        page: newPage,
        limit: 10,
        search: overrides?.search ?? search,
        status: overrides?.status ?? status,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<EventItem>)
        setPage(newPage)
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await deleteEvent(deleteId)
      if (result.success) {
        toast.success('Event deleted')
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

  const statusFilters = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Events</h1>
          <p className="text-brand-muted text-sm">Manage community events, workshops, and gatherings</p>
        </div>
        <Link href="/admin/events/new">
          <Button icon={<Plus className="w-4 h-4" />}>Create Event</Button>
        </Link>
      </div>

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
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          {
            key: 'title',
            label: 'Event',
            sortable: true,
            render: (item: EventItem) => (
              <div>
                <p className="font-medium text-brand-white">{item.title}</p>
                {item.eventType && <p className="text-xs text-brand-muted">{item.eventType}</p>}
              </div>
            ),
          },
          {
            key: 'date',
            label: 'Date & Time',
            sortable: true,
            render: (item: EventItem) => (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0" />
                <div>
                  <p className="text-sm text-brand-light-gray">{new Date(item.date).toLocaleDateString()}</p>
                  {item.startTime && <p className="text-xs text-brand-muted">{item.startTime}{item.endTime ? ` – ${item.endTime}` : ''}</p>}
                </div>
              </div>
            ),
          },
          {
            key: 'location',
            label: 'Location',
            render: (item: EventItem) => item.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" />
                <span className="text-sm">{item.location}</span>
              </div>
            ) : <span className="text-brand-muted">—</span>,
          },
          {
            key: 'registrations',
            label: 'Registrations',
            render: (item: EventItem) => (
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" />
                <span className="text-sm">{item._count.registrations}</span>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: EventItem) => <Badge variant={statusVariant[item.status] || 'draft'}>{item.status}</Badge>,
          },
        ]}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search events..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        onRowClick={(item) => router.push(`/admin/events/${item.id}`)}
        rowActions={(item: EventItem) => (
          <>
            <RowAction label="Edit" icon={<Edit className="w-4 h-4" />} onClick={() => router.push(`/admin/events/${item.id}`)} />
            <RowAction label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteId(item.id)} variant="danger" />
          </>
        )}
        emptyTitle="No events found"
        emptyDescription="Create your first event to get started."
        emptyAction={<Link href="/admin/events/new"><Button icon={<Plus className="w-4 h-4" />}>Create Event</Button></Link>}
      />

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="This event will be archived. Existing registrations will be preserved."
        confirmLabel="Delete"
        loading={isDeleting}
      />
    </div>
  )
}
