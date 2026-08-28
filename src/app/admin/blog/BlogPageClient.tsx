'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { deleteBlogPost } from '@/lib/actions/blog'
import type { PaginatedResult } from '@/lib/actions/utils'
import type { BlogPost, BlogCategory } from '@prisma/client'

export default function BlogPageClient({
  initialData,
}: {
  initialData: PaginatedResult<BlogPost & { category: BlogCategory | null }>
}) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id)
      const result = await deleteBlogPost(id)
      if (result.success) {
        toast.success('Blog post deleted successfully')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-white">Blog & News</h1>
          <p className="text-brand-gray-light mt-1">Manage articles and announcements</p>
        </div>
        <Link href="/admin/blog/new">
          <Button icon={<Plus className="w-4 h-4" />}>Write Post</Button>
        </Link>
      </div>

      <DataTable
        columns={[
          { key: 'title', label: 'Title', render: (row: any) => row.title },
          { key: 'category', label: 'Category', render: (row: any) => row.category?.name || 'Uncategorized' },
          { 
            key: 'status',
            label: 'Status', 
            render: (row: any) => (
              <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${row.status === 'PUBLISHED' ? 'bg-success/20 text-success' : 
                  row.status === 'DRAFT' ? 'bg-warning/20 text-warning' : 
                  'bg-brand-gray text-brand-white'}`}>
                {row.status}
              </span>
            ) 
          },
          { 
            key: 'date',
            label: 'Date', 
            render: (row: any) => row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : '-' 
          }
        ]}
        data={data.items}
        keyExtractor={(row) => row.id}
        rowActions={(row) => (
          <div className="flex gap-2">
            <Link href={`/admin/blog/${row.id}`}>
              <Button size="sm" variant="ghost" icon={<Edit className="w-4 h-4" />} />
            </Link>
            <Button 
              size="sm" 
              variant="danger" 
              icon={<Trash2 className="w-4 h-4" />} 
              loading={isDeleting === row.id}
              onClick={() => {
                if (confirm('Are you sure you want to delete this post?')) {
                  handleDelete(row.id)
                }
              }}
            />
          </div>
        )}
      />
    </div>
  )
}
