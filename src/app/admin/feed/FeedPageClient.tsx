'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable, { RowAction } from '@/components/ui/DataTable'
import type { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { deleteFeedProduct, getFeedProducts } from '@/lib/actions/feed'
import toast from 'react-hot-toast'
import type { PaginatedResult } from '@/lib/actions/utils'

type FeedItem = {
  id: string
  name: string
  category: string
  packageSize: string | null
  sellingPrice: unknown
  stockQuantity: number
  reorderLevel: number
  supplier: string | null
  status: string
  createdAt: Date
  [key: string]: unknown
}

const statusBadge = (status: string) => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'draft'> = {
    AVAILABLE: 'success',
    LOW_STOCK: 'warning',
    OUT_OF_STOCK: 'error',
    DISCONTINUED: 'draft',
    ARCHIVED: 'draft',
  }
  return <Badge variant={map[status] || 'draft'}>{status.replace('_', ' ')}</Badge>
}

const columns: Column<FeedItem>[] = [
  {
    key: 'name',
    label: 'Product',
    sortable: true,
    render: (item) => (
      <div>
        <span className="font-medium text-brand-white">{item.name}</span>
        {item.packageSize && <p className="text-xs text-brand-muted">{item.packageSize}</p>}
      </div>
    ),
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (item) => <Badge variant="info">{item.category}</Badge>,
  },
  {
    key: 'sellingPrice',
    label: 'Price',
    render: (item) => item.sellingPrice ? `${Number(item.sellingPrice).toLocaleString()} ETB` : '—',
  },
  {
    key: 'stockQuantity',
    label: 'Stock',
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        <span className={item.stockQuantity <= item.reorderLevel ? 'text-error font-bold' : 'text-brand-white'}>
          {item.stockQuantity}
        </span>
        {item.stockQuantity <= item.reorderLevel && (
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        )}
      </div>
    ),
  },
  { key: 'supplier', label: 'Supplier', render: (item) => item.supplier || '—' },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (item) => statusBadge(item.status),
  },
]

export default function FeedPageClient({
  initialData,
  initialSearch,
  initialStatus,
}: {
  initialData: PaginatedResult<FeedItem>
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
  const [deleteTarget, setDeleteTarget] = useState<FeedItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = (newPage: number, overrides?: { search?: string; status?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    startTransition(async () => {
      const result = await getFeedProducts({
        page: newPage, limit: 10,
        search: overrides?.search ?? search,
        status: overrides?.status ?? status,
        sortBy: overrides?.sortBy ?? sortBy,
        sortOrder: overrides?.sortOrder ?? sortOrder,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<FeedItem>)
        setPage(newPage)
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const result = await deleteFeedProduct(deleteTarget.id)
    setDeleting(false); setDeleteTarget(null)
    if (result.success) { toast.success('Feed product deleted'); fetchData(page) }
    else toast.error(result.error)
  }

  const statusFilters = ['ALL', 'AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK']

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Feed Products</h1>
          <p className="text-brand-muted text-sm">Manage feed inventory and stock levels</p>
        </div>
        <Link href="/admin/feed/new">
          <Button icon={<Plus className="w-4 h-4" />} className="rounded-full">Add Feed Product</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => { setStatus(s); fetchData(1, { status: s }) }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${status === s ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30' : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'}`}
          >{s === 'ALL' ? 'All' : s.replace('_', ' ')}</button>
        ))}
      </div>

      <DataTable
        columns={columns} data={data.items} loading={isPending}
        page={page} totalPages={data.meta.totalPages} total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search feed products..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        sortBy={sortBy} sortOrder={sortOrder}
        onSort={(key) => { const o = sortBy === key && sortOrder === 'desc' ? 'asc' : 'desc'; setSortBy(key); setSortOrder(o); fetchData(page, { sortBy: key, sortOrder: o }) }}
        emptyTitle="No feed products" emptyDescription="Add your first feed product."
        emptyAction={<Link href="/admin/feed/new"><Button size="sm" icon={<Plus className="w-4 h-4" />} className="rounded-full">Add Product</Button></Link>}
        rowActions={(item) => (
          <>
            <RowAction label="Edit" icon={<Pencil className="w-4 h-4" />} onClick={() => router.push(`/admin/feed/${item.id}`)} />
            <RowAction label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteTarget(item)} variant="danger" />
          </>
        )}
      />
      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Feed Product" message={`Delete "${deleteTarget?.name}"?`} confirmLabel="Delete" loading={deleting} />
    </div>
  )
}
