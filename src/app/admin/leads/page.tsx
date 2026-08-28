import { Suspense } from 'react'
import { getLeads, getStaffMembers } from '@/lib/actions/leads'
import LeadsPageClient from './LeadsPageClient'

export default async function LeadsAdminPage() {
  const [leadsResult, staffResult] = await Promise.all([
    getLeads({ page: 1, limit: 10 }),
    getStaffMembers(),
  ])

  const initialData = leadsResult.success
    ? leadsResult.data
    : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  const staffMembers = staffResult.success ? staffResult.data : []

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadsPageClient initialData={initialData} staffMembers={staffMembers} />
    </Suspense>
  )
}
