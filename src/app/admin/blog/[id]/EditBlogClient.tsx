'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { updateBlogPost } from '@/lib/actions/blog'
import type { BlogPost } from '@prisma/client'

export default function EditBlogClient({ post }: { post: BlogPost }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateBlogPost(post.id, formData)
      
      if (result.success) {
        toast.success('Blog post updated successfully')
        router.push('/admin/blog')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-white">Edit Post</h1>
          <p className="text-brand-gray-light mt-1">Update article details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-surface border border-white/10 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-brand-white">Title *</label>
            <input 
              type="text" 
              name="title" 
              defaultValue={post.title}
              required 
              className="w-full bg-brand-dark border border-white/10 rounded-md px-4 py-2 text-brand-white focus:outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-white">URL Slug *</label>
            <input 
              type="text" 
              name="slug" 
              defaultValue={post.slug}
              required 
              className="w-full bg-brand-dark border border-white/10 rounded-md px-4 py-2 text-brand-white focus:outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-white">Status *</label>
            <Select 
              name="status" 
              defaultValue={post.status} 
              options={[
                {value: "DRAFT", label: "Draft"},
                {value: "PUBLISHED", label: "Published"},
                {value: "ARCHIVED", label: "Archived"}
              ]} 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-brand-white">Excerpt / Summary</label>
            <Textarea 
              name="excerpt" 
              defaultValue={post.excerpt || ''}
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-brand-white">Full Content</label>
            <Textarea 
              name="content" 
              defaultValue={post.content || ''}
              rows={15}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Link href="/admin/blog">
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />}>
            Update Post
          </Button>
        </div>
      </form>
    </div>
  )
}
