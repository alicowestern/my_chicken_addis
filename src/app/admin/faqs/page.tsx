import { Suspense } from 'react'
import { getFAQs } from '@/lib/actions/content'
import FAQsPageClient from './FAQsPageClient'

export default async function FAQsAdminPage() {
  const result = await getFAQs({ page: 1, limit: 20, sortBy: 'displayOrder', sortOrder: 'asc' })

  const initialData = result.success
    ? result.data
    : { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FAQsPageClient initialData={initialData} />
    </Suspense>
  )
}
