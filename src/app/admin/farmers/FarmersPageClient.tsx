'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable, { RowAction } from '@/components/ui/DataTable'
import type { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { deleteFarmer, getFarmers } from '@/lib/actions/farmers'
import toast from 'react-hot-toast'
import type { PaginatedResult } from '@/lib/actions/utils'

type FarmerItem = {
  id: string
  farmerId: string
  fullName: string
  phone: string
  email: string | null
  location: string | null
  status: string
  birdCapacity: number | null
  createdAt: Date
  [key: string]: unknown
}

const statusBadge = (status: string) => {
  const map: Record<string, 'success' | 'warning' | 'info' | 'error' | 'draft'> = {
    ACTIVE: 'success',
    PROSPECT: 'info',
    INACTIVE: 'warning',
    ARCHIVED: 'draft',
  }
  return <Badge variant={map[status] || 'draft'}>{status}</Badge>
}

const columns: Column<FarmerItem>[] = [
  { key: 'farmerId', label: 'ID', sortable: true },
  {
    key: 'fullName',
    label: 'Name',
    sortable: true,
    render: (item) => (
      <span className="font-medium text-brand-white">{item.fullName}</span>
    ),
  },
  { key: 'phone', label: 'Phone', sortable: true },
  {
    key: 'location',
    label: 'Location',
    render: (item) => item.location || '—',
  },
  {
    key: 'birdCapacity',
    label: 'Capacity',
    render: (item) => item.birdCapacity ? `${item.birdCapacity} birds` : '—',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (item) => statusBadge(item.status),
  },
  {
    key: 'createdAt',
    label: 'Registered',
    sortable: true,
    render: (item) => new Date(item.createdAt).toLocaleDateString(),
  },
]

export default function FarmersPageClient({
  initialData,
  initialSearch,
  initialStatus,
}: {
  initialData: PaginatedResult<FarmerItem>
  initialSearch: string
  initialStatus: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [page, setPage] = useState(data.meta.page)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [deleteTarget, setDeleteTarget] = useState<FarmerItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = (newPage: number, newSearch?: string, newStatus?: string, newSortBy?: string, newSortOrder?: 'asc' | 'desc') => {
    const s = newSearch ?? search
    const st = newStatus ?? status
    const sb = newSortBy ?? sortBy
    const so = newSortOrder ?? sortOrder

    startTransition(async () => {
      const result = await getFarmers({ page: newPage, limit: 10, search: s, status: st, sortBy: sb, sortOrder: so })
      if (result.success) {
        setData(result.data as PaginatedResult<FarmerItem>)
        setPage(newPage)
      }
    })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    fetchData(1, value)
  }

  const handleSort = (key: string) => {
    const newOrder = sortBy === key && sortOrder === 'desc' ? 'asc' : 'desc'
    setSortBy(key)
    setSortOrder(newOrder)
    fetchData(page, undefined, undefined, key, newOrder)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const result = await deleteFarmer(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    if (result.success) {
      toast.success('Farmer deleted successfully')
      fetchData(page)
    } else {
      toast.error(result.error)
    }
  }

  const statusFilters = ['ALL', 'ACTIVE', 'PROSPECT', 'INACTIVE']

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Farmers</h1>
          <p className="text-brand-muted text-sm">Manage and track all registered farmers</p>
        </div>
        <Link href="/admin/farmers/new">
          <Button icon={<Plus className="w-4 h-4" />} className="rounded-full">
            Add Farmer
          </Button>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s)
              fetchData(1, undefined, s)
            }}
            className={`
              px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors
              ${status === s
                ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
                : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white hover:border-[rgba(255,255,255,0.2)]'
              }
            `}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search farmers by name, phone, ID..."
        searchValue={search}
        onSearchChange={handleSearch}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onRowClick={(item) => router.push(`/admin/farmers/${item.id}`)}
        emptyTitle="No farmers found"
        emptyDescription="Get started by adding your first farmer."
        emptyAction={
          <Link href="/admin/farmers/new">
            <Button size="sm" icon={<Plus className="w-4 h-4" />} className="rounded-full">
              Add Farmer
            </Button>
          </Link>
        }
        rowActions={(item) => (
          <>
            <RowAction label="View" icon={<Eye className="w-4 h-4" />} onClick={() => router.push(`/admin/farmers/${item.id}`)} />
            <RowAction label="Edit" icon={<Pencil className="w-4 h-4" />} onClick={() => router.push(`/admin/farmers/${item.id}?edit=true`)} />
            <RowAction label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteTarget(item)} variant="danger" />
          </>
        )}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Farmer"
        message={`Are you sure you want to delete "${deleteTarget?.fullName}"? This action will archive the farmer record.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  )
}
