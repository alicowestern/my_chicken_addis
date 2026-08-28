import { Suspense } from 'react'
import { getEvents } from '@/lib/actions/events'
import EventsPageClient from './EventsPageClient'

export default async function EventsAdminPage() {
  const result = await getEvents({ page: 1, limit: 10 })

  const initialData = result.success
    ? result.data
    : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsPageClient initialData={initialData} />
    </Suspense>
  )
}
