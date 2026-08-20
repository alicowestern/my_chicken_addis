import { getBirdProducts } from '@/lib/actions/birds'
import BirdsPageClient from './BirdsPageClient'

export const metadata = {
  title: 'Bird Products',
}

export default async function BirdsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const status = params.status || 'ALL'

  const result = await getBirdProducts({ page, limit: 10, search, status })

  return (
    <BirdsPageClient
      initialData={result.success ? result.data : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } }}
      initialSearch={search}
      initialStatus={status}
    />
  )
}
