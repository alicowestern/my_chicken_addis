'use server'

import { prisma } from '@/lib/database/prisma'
import {
  type ActionResult,
  type PaginatedResult,
  type PaginationParams,
  parsePagination,
  buildPaginationMeta,
  requirePermission,
  handleActionError,
} from '@/lib/actions/utils'
import { createTrainingCourseSchema, updateTrainingCourseSchema } from '@/lib/validations'
import type { TrainingCourse, TrainingRegistration, TrainingEvent } from '@prisma/client'

// ============================================================
// TYPES
// ============================================================

type TrainingCourseWithCounts = TrainingCourse & {
  _count: { registrations: number; events: number }
}

type TrainingCourseDetail = TrainingCourse & {
  events: TrainingEvent[]
  registrations: (TrainingRegistration & { event: TrainingEvent | null })[]
}

// ============================================================
// GET TRAINING COURSES (Paginated)
// ============================================================

export async function getTrainingCourses(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<TrainingCourseWithCounts>>> {
  try {
    await requirePermission('training:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = { deletedAt: null }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { trainer: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.trainingCourse.findMany({
        where,
        include: { _count: { select: { registrations: true, events: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.trainingCourse.count({ where }),
    ])

    return {
      success: true,
      data: { items: items as TrainingCourseWithCounts[], meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET TRAINING COURSE BY ID
// ============================================================

export async function getTrainingCourseById(id: string): Promise<ActionResult<TrainingCourseDetail>> {
  try {
    await requirePermission('training:read')

    const course = await prisma.trainingCourse.findUnique({
      where: { id },
      include: {
        events: { orderBy: { date: 'desc' } },
        registrations: {
          include: { event: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!course) {
      return { success: false, error: 'Training course not found' }
    }

    return { success: true, data: course as TrainingCourseDetail }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// CREATE TRAINING COURSE
// ============================================================

export async function createTrainingCourse(formData: FormData): Promise<ActionResult<TrainingCourse>> {
  try {
    await requirePermission('training:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = createTrainingCourseSchema.parse(raw)

    const course = await prisma.trainingCourse.create({
      data: {
        ...parsed,
        price: parsed.price ?? null,
        capacity: parsed.capacity ?? null,
      },
    })

    return { success: true, data: course }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE TRAINING COURSE
// ============================================================

export async function updateTrainingCourse(id: string, formData: FormData): Promise<ActionResult<TrainingCourse>> {
  try {
    await requirePermission('training:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateTrainingCourseSchema.parse(raw)

    const course = await prisma.trainingCourse.update({
      where: { id },
      data: {
        ...parsed,
        price: parsed.price ?? undefined,
        capacity: parsed.capacity ?? undefined,
      },
    })

    return { success: true, data: course }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// DELETE TRAINING COURSE (Soft Delete)
// ============================================================

export async function deleteTrainingCourse(id: string): Promise<ActionResult> {
  try {
    await requirePermission('training:delete')

    await prisma.trainingCourse.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}
