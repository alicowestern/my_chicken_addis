import { getFarmers } from '@/lib/actions/farmers'
import FarmersPageClient from './FarmersPageClient'

export const metadata = {
  title: 'Farmers',
}

export default async function FarmersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const status = params.status || 'ALL'

  const result = await getFarmers({ page, limit: 10, search, status })

  return (
    <FarmersPageClient
      initialData={result.success ? result.data : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } }}
      initialSearch={search}
      initialStatus={status}
    />
  )
}
