'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Spinner } from '@/components/ui/index'
import { getGallery, createMedia, deleteMedia } from '@/lib/actions/content'
import type { PaginatedResult } from '@/lib/actions/utils'

type MediaItem = {
  id: string
  url: string
  alt: string | null
  caption: string | null
  category: string
  createdAt: Date
  [key: string]: unknown
}

const CATEGORIES = ['ALL', 'FARM', 'BIRDS', 'FEED', 'TRAINING', 'FARMERS', 'EVENTS', 'TEAM', 'FACILITIES', 'BLOG', 'GENERAL']

export default function GalleryPageClient({
  initialData,
}: {
  initialData: PaginatedResult<MediaItem>
}) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [category, setCategory] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)
  const [isUploading, setIsUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Upload form
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [uploadCategory, setUploadCategory] = useState('GENERAL')

  const fetchData = (newPage: number, overrides?: { category?: string }) => {
    startTransition(async () => {
      const result = await getGallery({
        page: newPage, limit: 24,
        category: overrides?.category ?? category,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<MediaItem>)
        setPage(newPage)
      }
    })
  }

  const handleUpload = async () => {
    if (!url.trim()) { toast.error('Image URL is required'); return }
    setIsSaving(true)
    try {
      const fd = new FormData()
      fd.set('url', url)
      fd.set('alt', alt)
      fd.set('caption', caption)
      fd.set('category', uploadCategory)

      const result = await createMedia(fd)
      if (result.success) {
        toast.success('Media added')
        setIsUploading(false)
        setUrl(''); setAlt(''); setCaption(''); setUploadCategory('GENERAL')
        fetchData(page)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await deleteMedia(deleteId)
      if (result.success) {
        toast.success('Media deleted')
        setDeleteId(null)
        fetchData(page)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Gallery</h1>
          <p className="text-brand-muted text-sm">Manage photos and media for the website</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsUploading(true)}>Add Media</Button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => { setCategory(c); fetchData(1, { category: c }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${category === c
              ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
              : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'
            }`}
          >
            {c === 'ALL' ? 'All' : c}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {isPending ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)]">
          <ImageIcon className="w-12 h-12 text-brand-muted mb-4" />
          <h3 className="text-lg font-semibold text-brand-white">No media found</h3>
          <p className="text-sm text-brand-muted mt-1">Upload images to build your gallery.</p>
          <Button className="mt-6" icon={<Plus className="w-4 h-4" />} onClick={() => setIsUploading(true)}>Add Media</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {data.items.map((item) => (
            <div key={item.id} className="group relative bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden aspect-square">
              <img
                src={item.url}
                alt={item.alt || 'Gallery image'}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23242424" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23666" font-size="12">No Image</text></svg>' }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-1">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md bg-brand-dark/80 text-brand-cyan hover:bg-brand-dark transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-md bg-brand-dark/80 text-error hover:bg-brand-dark transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <Badge variant="info">{item.category}</Badge>
                  {item.caption && <p className="text-xs text-brand-light-gray mt-1 truncate">{item.caption}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="ghost" size="sm" onClick={() => fetchData(page - 1)} disabled={page <= 1}>Previous</Button>
          <span className="px-4 py-2 text-sm text-brand-muted">Page {page} of {data.meta.totalPages}</span>
          <Button variant="ghost" size="sm" onClick={() => fetchData(page + 1)} disabled={page >= data.meta.totalPages}>Next</Button>
        </div>
      )}

      {/* Upload Modal */}
      <Modal open={isUploading} onClose={() => setIsUploading(false)} title="Add Media" size="md">
        <div className="space-y-4">
          <Input label="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://images.unsplash.com/..." required />
          {url && (
            <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.05)] max-h-40">
              <img src={url} alt="Preview" className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          )}
          <Input label="Alt Text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" />
          <Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional caption" />
          <Select label="Category" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}
            options={CATEGORIES.filter(c => c !== 'ALL').map(c => ({ label: c, value: c }))}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsUploading(false)}>Cancel</Button>
            <Button onClick={handleUpload} loading={isSaving}>Add Media</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Media" message="This media will be permanently deleted." confirmLabel="Delete" loading={isDeleting} />
    </div>
  )
}
