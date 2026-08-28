'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '@/components/ui/DataTable'
import { RowAction } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/lib/actions/content'
import type { PaginatedResult } from '@/lib/actions/utils'

type FAQItem = {
  id: string
  question: string
  answer: string
  category: string
  displayOrder: number
  status: string
  [key: string]: unknown
}

export default function FAQsPageClient({
  initialData,
}: {
  initialData: PaginatedResult<FAQItem>
}) {
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)

  // Modal state
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form state
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [faqCategory, setFaqCategory] = useState('GENERAL')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [faqStatus, setFaqStatus] = useState('ACTIVE')

  const fetchData = (newPage: number, overrides?: { search?: string; category?: string }) => {
    startTransition(async () => {
      const result = await getFAQs({
        page: newPage, limit: 20,
        search: overrides?.search ?? search,
        category: overrides?.category ?? category,
        sortBy: 'displayOrder', sortOrder: 'asc',
      })
      if (result.success) {
        setData(result.data as PaginatedResult<FAQItem>)
        setPage(newPage)
      }
    })
  }

  const openCreate = () => {
    setQuestion(''); setAnswer(''); setFaqCategory('GENERAL'); setDisplayOrder(0); setFaqStatus('ACTIVE')
    setEditingFAQ(null); setIsCreating(true)
  }

  const openEdit = (faq: FAQItem) => {
    setQuestion(faq.question); setAnswer(faq.answer); setFaqCategory(faq.category); setDisplayOrder(faq.displayOrder); setFaqStatus(faq.status)
    setEditingFAQ(faq); setIsCreating(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const fd = new FormData()
      fd.set('question', question)
      fd.set('answer', answer)
      fd.set('category', faqCategory)
      fd.set('displayOrder', String(displayOrder))
      fd.set('status', faqStatus)

      const result = editingFAQ
        ? await updateFAQ(editingFAQ.id, fd)
        : await createFAQ(fd)

      if (result.success) {
        toast.success(editingFAQ ? 'FAQ updated' : 'FAQ created')
        setIsCreating(false)
        setEditingFAQ(null)
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
      const result = await deleteFAQ(deleteId)
      if (result.success) {
        toast.success('FAQ deleted')
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

  const categories = ['ALL', 'GENERAL', 'BIRDS', 'FEED', 'TRAINING', 'FINANCING']

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">FAQs</h1>
          <p className="text-brand-muted text-sm">Manage frequently asked questions</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add FAQ</Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((c) => (
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

      <DataTable
        columns={[
          { key: 'displayOrder', label: '#', render: (item: FAQItem) => <span className="text-brand-muted font-mono text-xs">{item.displayOrder}</span> },
          {
            key: 'question', label: 'Question',
            render: (item: FAQItem) => <p className="text-sm font-medium text-brand-white max-w-md truncate">{item.question}</p>,
          },
          {
            key: 'category', label: 'Category',
            render: (item: FAQItem) => <Badge variant="info">{item.category}</Badge>,
          },
          {
            key: 'status', label: 'Status',
            render: (item: FAQItem) => <Badge variant={item.status === 'ACTIVE' ? 'success' : 'draft'}>{item.status}</Badge>,
          },
        ]}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search FAQs..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        rowActions={(item: FAQItem) => (
          <>
            <RowAction label="Edit" icon={<Edit className="w-4 h-4" />} onClick={() => openEdit(item)} />
            <RowAction label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteId(item.id)} variant="danger" />
          </>
        )}
        emptyTitle="No FAQs found"
        emptyDescription="Add your first FAQ."
        emptyAction={<Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add FAQ</Button>}
      />

      {/* Create/Edit Modal */}
      <Modal open={isCreating} onClose={() => { setIsCreating(false); setEditingFAQ(null) }} title={editingFAQ ? 'Edit FAQ' : 'New FAQ'} size="lg">
        <div className="space-y-4">
          <Input label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What do farmers often ask?" />
          <Textarea label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder="Provide a clear, helpful answer..." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Category" value={faqCategory} onChange={(e) => setFaqCategory(e.target.value)}
              options={[
                { label: 'General', value: 'GENERAL' },
                { label: 'Birds', value: 'BIRDS' },
                { label: 'Feed', value: 'FEED' },
                { label: 'Training', value: 'TRAINING' },
                { label: 'Financing', value: 'FINANCING' },
              ]}
            />
            <Input label="Display Order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
            <Select label="Status" value={faqStatus} onChange={(e) => setFaqStatus(e.target.value)}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => { setIsCreating(false); setEditingFAQ(null) }}>Cancel</Button>
            <Button onClick={handleSave} loading={isSaving}>{editingFAQ ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete FAQ" message="This FAQ will be permanently deleted." confirmLabel="Delete" loading={isDeleting} />
    </div>
  )
}
