import { getFeedProducts } from '@/lib/actions/feed'
import FeedPageClient from './FeedPageClient'

export const metadata = {
  title: 'Feed Products',
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; category?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const status = params.status || 'ALL'
  const category = params.category || 'ALL'

  const result = await getFeedProducts({ page, limit: 10, search, status, category })

  return (
    <FeedPageClient
      initialData={result.success ? result.data : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } }}
      initialSearch={search}
      initialStatus={status}
    />
  )
}
