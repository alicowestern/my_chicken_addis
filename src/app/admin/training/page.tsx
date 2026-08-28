import { Suspense } from 'react'
import { getTrainingCourses } from '@/lib/actions/training'
import TrainingPageClient from './TrainingPageClient'

export default async function TrainingAdminPage() {
  const result = await getTrainingCourses({ page: 1, limit: 10 })

  const initialData = result.success
    ? result.data
    : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrainingPageClient initialData={initialData} />
    </Suspense>
  )
}
