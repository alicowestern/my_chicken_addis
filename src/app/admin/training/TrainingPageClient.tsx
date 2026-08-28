'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, GraduationCap, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import DataTable from '@/components/ui/DataTable'
import { RowAction } from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import { getTrainingCourses, deleteTrainingCourse } from '@/lib/actions/training'
import type { PaginatedResult } from '@/lib/actions/utils'

type CourseItem = {
  id: string
  name: string
  category: string | null
  trainer: string | null
  duration: string | null
  price: unknown
  status: string
  _count: { registrations: number; events: number }
  [key: string]: unknown
}

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'error' | 'draft'> = {
  ACTIVE: 'success',
  DRAFT: 'draft',
  COMPLETED: 'info',
  ARCHIVED: 'error',
}

export default function TrainingPageClient({
  initialData,
}: {
  initialData: PaginatedResult<CourseItem>
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState(initialData)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [page, setPage] = useState(data.meta.page)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = (newPage: number, overrides?: { search?: string; status?: string }) => {
    startTransition(async () => {
      const result = await getTrainingCourses({
        page: newPage,
        limit: 10,
        search: overrides?.search ?? search,
        status: overrides?.status ?? status,
      })
      if (result.success) {
        setData(result.data as PaginatedResult<CourseItem>)
        setPage(newPage)
      }
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await deleteTrainingCourse(deleteId)
      if (result.success) {
        toast.success('Course archived')
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

  const statusFilters = ['ALL', 'ACTIVE', 'DRAFT', 'COMPLETED', 'ARCHIVED']

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-brand-white mb-1 text-left">Training</h1>
          <p className="text-brand-muted text-sm">Manage training courses and track registrations</p>
        </div>
        <Link href="/admin/training/new">
          <Button icon={<Plus className="w-4 h-4" />}>New Course</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); fetchData(1, { status: s }) }}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${status === s
              ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30'
              : 'text-brand-muted border-[rgba(255,255,255,0.1)] hover:text-brand-white'
            }`}
          >
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            label: 'Course',
            sortable: true,
            render: (item: CourseItem) => (
              <div>
                <p className="font-medium text-brand-white">{item.name}</p>
                {item.category && <p className="text-xs text-brand-muted">{item.category}</p>}
              </div>
            ),
          },
          {
            key: 'trainer',
            label: 'Trainer',
            render: (item: CourseItem) => <span className="text-sm">{item.trainer || '—'}</span>,
          },
          {
            key: 'duration',
            label: 'Duration',
            render: (item: CourseItem) => <span className="text-sm">{item.duration || '—'}</span>,
          },
          {
            key: 'price',
            label: 'Price',
            render: (item: CourseItem) => (
              <span className="text-sm">{item.price ? `${Number(item.price).toLocaleString()} ETB` : 'Free'}</span>
            ),
          },
          {
            key: 'registrations',
            label: 'Registrations',
            render: (item: CourseItem) => (
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-brand-muted" /> {item._count.registrations}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-muted" /> {item._count.events}
                </span>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item: CourseItem) => <Badge variant={statusVariant[item.status] || 'draft'}>{item.status}</Badge>,
          },
        ]}
        data={data.items}
        loading={isPending}
        page={page}
        totalPages={data.meta.totalPages}
        total={data.meta.total}
        onPageChange={(p) => fetchData(p)}
        searchPlaceholder="Search courses..."
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); fetchData(1, { search: v }) }}
        onRowClick={(item) => router.push(`/admin/training/${item.id}`)}
        rowActions={(item: CourseItem) => (
          <>
            <RowAction label="Edit" icon={<Edit className="w-4 h-4" />} onClick={() => router.push(`/admin/training/${item.id}`)} />
            <RowAction label="Archive" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteId(item.id)} variant="danger" />
          </>
        )}
        emptyTitle="No courses found"
        emptyDescription="Create your first training course."
        emptyAction={<Link href="/admin/training/new"><Button icon={<Plus className="w-4 h-4" />}>New Course</Button></Link>}
      />

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Archive Course"
        message="This course will be archived. Existing registrations will be preserved."
        confirmLabel="Archive"
        loading={isDeleting}
      />
    </div>
  )
}
