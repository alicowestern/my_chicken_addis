'use client'

import React, { useState, useTransition } from 'react'
import { Shield, Clock } from 'lucide-react'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import { getAuditLogs } from '@/lib/actions/admin'
import type { PaginatedResult } from '@/lib/actions/utils'
import { formatDistanceToNow } from 'date-fns'

type AuditItem = {
  id: string
  action: string
  entity: string
  entityId: string | null
  details: unknown
  ipAddress: string | null
  user: { name: string; email: string } | null
  createdAt: Date
  [key: string]: unknown
}

const actionVariant: Record<string, 'success' | 'info' | 'warning' | 'error' | 'draft'> = {
  CREATE: 'success',
  READ: 'info',
  UPDATE: 'warning',
  DELETE: 'error',
  LOGIN: 'info',
  LOGOUT: 'draft',
  EXPORT: 'warning',
}

export default function AuditPageClient({
  initialData,
}: {
  initialData: PaginatedResult<AuditItem>
}) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [entity, setEntity] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)

  const fetchData = (newPage: number, overrides?: { search?: string; entity?: string }) => {
    startTransition(async () => {
      const result = await getAuditLogs({
        page: newPage, limit: 20,
        search: overrides?.search ?? search,
        entity: overrides?.entity ?? entity,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<AuditItem>)
        setPage(newPage)
      }
    })
  }

  const entities = ['ALL', 'USER', 'LEAD', 'ORDER', 'BIRD', 'FEED', 'FARMER', 'EVENT', 'BLOG', 'TRAINING', 'FINANCING', 'FAQ', 'TESTIMONIAL', 'MEDIA', 'SETTING']

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-brand-cyan" />
          <h1 className="text-2xl font-bold font-heading text-brand-white text-left">Audit Log</h1>
        </div>
        <p className="text-brand-muted text-sm">Track all administrative actions across the system</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {entities.map((e) => (
          <button key={e} onClick={() => { setEntity(e); fetchData(1, { entity: e }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${entity === e
              ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
              : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'
            }`}
          >
            {e === 'ALL' ? 'All' : e}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          {
            key: 'createdAt', label: 'When',
            render: (item: AuditItem) => (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-muted" />
                <span className="text-xs text-brand-light-gray">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
              </div>
            ),
          },
          {
            key: 'user', label: 'User',
            render: (item: AuditItem) => (
              <div>
                <p className="text-sm font-medium text-brand-white">{item.user?.name || 'System'}</p>
                {item.user?.email && <p className="text-xs text-brand-muted">{item.user.email}</p>}
              </div>
            ),
          },
          {
            key: 'action', label: 'Action',
            render: (item: AuditItem) => <Badge variant={actionVariant[item.action] || 'draft'}>{item.action}</Badge>,
          },
          {
            key: 'entity', label: 'Entity',
            render: (item: AuditItem) => (
              <div>
                <span className="text-sm text-brand-light-gray">{item.entity}</span>
                {item.entityId && <span className="text-xs text-brand-muted ml-2 font-mono">#{item.entityId.slice(0, 8)}</span>}
              </div>
            ),
          },
          {
            key: 'details', label: 'Details',
            render: (item: AuditItem) => (
              <span className="text-xs text-brand-muted max-w-[200px] truncate block">
                {item.details ? JSON.stringify(item.details).slice(0, 60) : '—'}
              </span>
            ),
          },
          {
            key: 'ipAddress', label: 'IP',
            render: (item: AuditItem) => <span className="text-xs text-brand-muted font-mono">{item.ipAddress || '—'}</span>,
          },
        ]}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search by action, entity, user..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        emptyTitle="No audit logs found"
        emptyDescription="Activity logs will appear here as actions are performed."
      />
    </div>
  )
}
