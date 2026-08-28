import { notFound } from 'next/navigation'
import { getBlogPostById } from '@/lib/actions/blog'
import EditBlogClient from './EditBlogClient'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const response = await getBlogPostById(id)
  if (!response.success) {
    notFound()
  }

  return <EditBlogClient post={response.data} />
}
