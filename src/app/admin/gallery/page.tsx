import { Suspense } from 'react'
import { getGallery } from '@/lib/actions/content'
import GalleryPageClient from './GalleryPageClient'

export default async function GalleryAdminPage() {
  const result = await getGallery({ page: 1, limit: 24 })

  const initialData = result.success
    ? result.data
    : { items: [], meta: { page: 1, limit: 24, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryPageClient initialData={initialData} />
    </Suspense>
  )
}
