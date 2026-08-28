import { Suspense } from 'react'
import { getFinancingApplications, getFinanceOfficers } from '@/lib/actions/financing'
import FinancingPageClient from './FinancingPageClient'

export default async function FinancingAdminPage() {
  const [appsResult, officersResult] = await Promise.all([
    getFinancingApplications({ page: 1, limit: 10 }),
    getFinanceOfficers(),
  ])

  const initialData = appsResult.success
    ? appsResult.data
    : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  const officers = officersResult.success ? officersResult.data : []

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FinancingPageClient initialData={initialData} officers={officers} />
    </Suspense>
  )
}
