import { getBirdOrders } from '@/lib/actions/orders'
import OrdersPageClient from './OrdersPageClient'

export const metadata = {
  title: 'Orders',
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; tab?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const status = params.status || 'ALL'

  const result = await getBirdOrders({ page, limit: 10, search, status })

  return (
    <OrdersPageClient
      initialData={result.success ? result.data : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false } }}
      initialSearch={search}
      initialStatus={status}
    />
  )
}
