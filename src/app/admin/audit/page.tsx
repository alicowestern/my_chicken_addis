import { Suspense } from 'react'
import { getAuditLogs } from '@/lib/actions/admin'
import AuditPageClient from './AuditPageClient'

export default async function AuditAdminPage() {
  const result = await getAuditLogs({ page: 1, limit: 20 })

  const initialData = result.success
    ? result.data
    : { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuditPageClient initialData={initialData} />
    </Suspense>
  )
}
