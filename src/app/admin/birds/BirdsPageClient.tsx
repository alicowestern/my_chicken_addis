'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable, { RowAction } from '@/components/ui/DataTable'
import type { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteBirdProduct, getBirdProducts } from '@/lib/actions/birds'
import toast from 'react-hot-toast'
import type { PaginatedResult } from '@/lib/actions/utils'

type BirdItem = {
  id: string
  name: string
  birdType: string
  age: string | null
  weight: string | null
  price: unknown
  availableQuantity: number
  status: string
  createdAt: Date
  [key: string]: unknown
}

const statusBadge = (status: string) => {
  const map: Record<string, 'success' | 'info' | 'warning' | 'error' | 'draft'> = {
    AVAILABLE: 'success',
    LIMITED: 'warning',
    SOLD_OUT: 'error',
    UPCOMING: 'info',
    ARCHIVED: 'draft',
  }
  return <Badge variant={map[status] || 'draft'}>{status.replace('_', ' ')}</Badge>
}

const columns: Column<BirdItem>[] = [
  {
    key: 'name',
    label: 'Product',
    sortable: true,
    render: (item) => (
      <div>
        <span className="font-medium text-brand-white">{item.name}</span>
        <p className="text-xs text-brand-muted">{item.birdType}</p>
      </div>
    ),
  },
  { key: 'age', label: 'Age', render: (item) => item.age || '—' },
  { key: 'weight', label: 'Weight', render: (item) => item.weight || '—' },
  {
    key: 'price',
    label: 'Price',
    render: (item) => item.price ? `${Number(item.price).toLocaleString()} ETB` : '—',
  },
  {
    key: 'availableQuantity',
    label: 'Stock',
    sortable: true,
    render: (item) => (
      <span className={item.availableQuantity === 0 ? 'text-error' : item.availableQuantity < 50 ? 'text-warning' : 'text-success'}>
        {item.availableQuantity.toLocaleString()}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (item) => statusBadge(item.status),
  },
]

export default function BirdsPageClient({
  initialData,
  initialSearch,
  initialStatus,
}: {
  initialData: PaginatedResult<BirdItem>
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
  const [deleteTarget, setDeleteTarget] = useState<BirdItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = (newPage: number, newSearch?: string, newStatus?: string, newSortBy?: string, newSortOrder?: 'asc' | 'desc') => {
    startTransition(async () => {
      const result = await getBirdProducts({
        page: newPage,
        limit: 10,
        search: newSearch ?? search,
        status: newStatus ?? status,
        sortBy: newSortBy ?? sortBy,
        sortOrder: newSortOrder ?? sortOrder,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<BirdItem>)
        setPage(newPage)
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const result = await deleteBirdProduct(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    if (result.success) {
      toast.success('Bird product deleted')
      fetchData(page)
    } else {
      toast.error(result.error)
    }
  }

  const statusFilters = ['ALL', 'AVAILABLE', 'LIMITED', 'SOLD_OUT', 'UPCOMING']

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Bird Products</h1>
          <p className="text-brand-muted text-sm">Manage bird products and stock levels</p>
        </div>
        <Link href="/admin/birds/new">
          <Button icon={<Plus className="w-4 h-4" />} className="rounded-full">Add Bird Product</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); fetchData(1, undefined, s) }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${status === s ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30' : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'}`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
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
        searchPlaceholder="Search bird products..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, v) }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(key) => {
          const order = sortBy === key && sortOrder === 'desc' ? 'asc' : 'desc'
          setSortBy(key); setSortOrder(order)
          fetchData(page, undefined, undefined, key, order)
        }}
        emptyTitle="No bird products"
        emptyDescription="Add your first bird product to get started."
        emptyAction={<Link href="/admin/birds/new"><Button size="sm" icon={<Plus className="w-4 h-4" />} className="rounded-full">Add Product</Button></Link>}
        rowActions={(item) => (
          <>
            <RowAction label="Edit" icon={<Pencil className="w-4 h-4" />} onClick={() => router.push(`/admin/birds/${item.id}`)} />
            <RowAction label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteTarget(item)} variant="danger" />
          </>
        )}
      />

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Bird Product" message={`Delete "${deleteTarget?.name}"?`} confirmLabel="Delete" loading={deleting} />
    </div>
  )
}
