'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import DataTable from '@/components/ui/DataTable'
import type { Column } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import { getBirdOrders, getFeedOrders } from '@/lib/actions/orders'
import type { PaginatedResult } from '@/lib/actions/utils'

type OrderItem = {
  id: string
  orderNumber: string
  customerName: string | null
  customerPhone: string | null
  status: string
  deliveryMethod: string
  totalAmount: unknown
  orderDate: Date
  farmer: { fullName: string; farmerId: string } | null
  items: { quantity: number; product: { name: string } }[]
  [key: string]: unknown
}

const statusBadge = (status: string) => {
  const map: Record<string, 'info' | 'warning' | 'success' | 'error' | 'available' | 'pending' | 'draft'> = {
    NEW: 'info',
    CONFIRMED: 'available',
    PREPARING: 'pending',
    READY: 'warning',
    DELIVERED: 'success',
    COMPLETED: 'success',
    CANCELLED: 'error',
  }
  return <Badge variant={map[status] || 'draft'}>{status}</Badge>
}

const birdColumns: Column<OrderItem>[] = [
  {
    key: 'orderNumber',
    label: 'Order #',
    render: (item) => <span className="font-mono text-brand-cyan text-xs">{item.orderNumber.slice(0, 10)}...</span>,
  },
  {
    key: 'customerName',
    label: 'Customer',
    sortable: true,
    render: (item) => (
      <div>
        <span className="font-medium text-brand-white">{item.farmer?.fullName || item.customerName || '—'}</span>
        {item.customerPhone && <p className="text-xs text-brand-muted">{item.customerPhone}</p>}
      </div>
    ),
  },
  {
    key: 'items',
    label: 'Items',
    render: (item) => (
      <span className="text-sm">
        {item.items.map((i) => `${i.product.name} × ${i.quantity}`).join(', ') || '—'}
      </span>
    ),
  },
  {
    key: 'deliveryMethod',
    label: 'Delivery',
    render: (item) => item.deliveryMethod,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (item) => statusBadge(item.status),
  },
  {
    key: 'orderDate',
    label: 'Date',
    sortable: true,
    render: (item) => new Date(item.orderDate).toLocaleDateString(),
  },
]

export default function OrdersPageClient({
  initialData,
  initialSearch,
  initialStatus,
}: {
  initialData: PaginatedResult<OrderItem>
  initialSearch: string
  initialStatus: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState<'birds' | 'feed'>('birds')
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [page, setPage] = useState(data.meta.page)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchData = (newPage: number, overrides?: { search?: string; status?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; tab?: 'birds' | 'feed' }) => {
    const currentTab = overrides?.tab ?? tab
    startTransition(async () => {
      const fetcher = currentTab === 'birds' ? getBirdOrders : getFeedOrders
      const result = await fetcher({
        page: newPage, limit: 10,
        search: overrides?.search ?? search,
        status: overrides?.status ?? status,
        sortBy: overrides?.sortBy ?? sortBy,
        sortOrder: overrides?.sortOrder ?? sortOrder,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<OrderItem>)
        setPage(newPage)
      }
    })
  }

  const switchTab = (newTab: 'birds' | 'feed') => {
    setTab(newTab)
    setSearch('')
    setStatus('ALL')
    setPage(1)
    fetchData(1, { tab: newTab, search: '', status: 'ALL' })
  }

  const statusFilters = ['ALL', 'NEW', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'COMPLETED', 'CANCELLED']

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Orders</h1>
        <p className="text-brand-muted text-sm">Manage bird and feed orders</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 bg-brand-dark p-1 rounded-lg inline-flex border border-[rgba(255,255,255,0.05)]">
        <button
          onClick={() => switchTab('birds')}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'birds' ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-brand-muted hover:text-brand-white'}`}
        >
          Bird Orders
        </button>
        <button
          onClick={() => switchTab('feed')}
          className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'feed' ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-brand-muted hover:text-brand-white'}`}
        >
          Feed Orders
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => { setStatus(s); fetchData(1, { status: s }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${status === s ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30' : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'}`}
          >{s === 'ALL' ? 'All' : s}</button>
        ))}
      </div>

      <DataTable
        columns={birdColumns}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search by order #, customer name or phone..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(key) => { const o = sortBy === key && sortOrder === 'desc' ? 'asc' : 'desc'; setSortBy(key); setSortOrder(o); fetchData(page, { sortBy: key, sortOrder: o }) }}
        onRowClick={(item) => router.push(`/admin/orders/${item.id}`)}
        emptyTitle="No orders found"
        emptyDescription={`No ${tab} orders match your criteria.`}
      />
    </div>
  )
}
