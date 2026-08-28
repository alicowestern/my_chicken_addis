import { Suspense } from 'react'
import { getTestimonials } from '@/lib/actions/content'
import TestimonialsPageClient from './TestimonialsPageClient'

export default async function TestimonialsAdminPage() {
  const result = await getTestimonials({ page: 1, limit: 10 })

  const initialData = result.success
    ? result.data
    : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestimonialsPageClient initialData={initialData} />
    </Suspense>
  )
}
