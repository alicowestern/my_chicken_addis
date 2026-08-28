import { Suspense } from 'react'
import { getBlogPosts } from '@/lib/actions/blog'
import BlogPageClient from './BlogPageClient'

export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  const search = typeof params.search === 'string' ? params.search : ''
  const limit = 10

  const response = await getBlogPosts({ page, limit, search })
  
  const initialData = response.success ? response.data : { items: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageClient initialData={initialData} />
    </Suspense>
  )
}
