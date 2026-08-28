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
import {
  createFAQSchema,
  updateFAQSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
} from '@/lib/validations'
import type { FAQ, Testimonial, Media } from '@prisma/client'

// ============================================================
// FAQ MANAGEMENT
// ============================================================

export async function getFAQs(
  params: PaginationParams & { category?: string; status?: string }
): Promise<ActionResult<PaginatedResult<FAQ>>> {
  try {
    await requirePermission('faqs:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {}

    if (params.category && params.category !== 'ALL') {
      where.category = params.category
    }
    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        orderBy: sortBy === 'displayOrder' ? { displayOrder: sortOrder } : { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.fAQ.count({ where }),
    ])

    return {
      success: true,
      data: { items, meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function createFAQ(formData: FormData): Promise<ActionResult<FAQ>> {
  try {
    await requirePermission('faqs:write')
    const raw = Object.fromEntries(formData.entries())
    const parsed = createFAQSchema.parse(raw)

    const faq = await prisma.fAQ.create({ data: parsed })
    return { success: true, data: faq }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateFAQ(id: string, formData: FormData): Promise<ActionResult<FAQ>> {
  try {
    await requirePermission('faqs:write')
    const raw = Object.fromEntries(formData.entries())
    const parsed = updateFAQSchema.parse(raw)

    const faq = await prisma.fAQ.update({ where: { id }, data: parsed })
    return { success: true, data: faq }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteFAQ(id: string): Promise<ActionResult> {
  try {
    await requirePermission('faqs:delete')
    await prisma.fAQ.delete({ where: { id } })
    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// TESTIMONIAL MANAGEMENT
// ============================================================

export async function getTestimonials(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<Testimonial>>> {
  try {
    await requirePermission('testimonials:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {}

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { farmerName: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ])

    return {
      success: true,
      data: { items, meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function createTestimonial(formData: FormData): Promise<ActionResult<Testimonial>> {
  try {
    await requirePermission('testimonials:write')
    const raw = Object.fromEntries(formData.entries())
    const parsed = createTestimonialSchema.parse(raw)

    const testimonial = await prisma.testimonial.create({ data: parsed })
    return { success: true, data: testimonial }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateTestimonial(id: string, formData: FormData): Promise<ActionResult<Testimonial>> {
  try {
    await requirePermission('testimonials:write')
    const raw = Object.fromEntries(formData.entries())
    const parsed = updateTestimonialSchema.parse(raw)

    const testimonial = await prisma.testimonial.update({ where: { id }, data: parsed })
    return { success: true, data: testimonial }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await requirePermission('testimonials:delete')
    await prisma.testimonial.delete({ where: { id } })
    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GALLERY / MEDIA MANAGEMENT
// ============================================================

export async function getGallery(
  params: PaginationParams & { category?: string }
): Promise<ActionResult<PaginatedResult<Media>>> {
  try {
    await requirePermission('gallery:read')
    const { page, limit, skip, search } = parsePagination(params)

    const where: Record<string, unknown> = {}

    if (params.category && params.category !== 'ALL') {
      where.category = params.category
    }

    if (search) {
      where.OR = [
        { alt: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ])

    return {
      success: true,
      data: { items, meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function createMedia(formData: FormData): Promise<ActionResult<Media>> {
  try {
    await requirePermission('gallery:write')

    const raw = Object.fromEntries(formData.entries())

    const media = await prisma.media.create({
      data: {
        url: raw.url as string,
        alt: (raw.alt as string) || null,
        caption: (raw.caption as string) || null,
        category: (raw.category as string as Media['category']) || 'GENERAL',
      },
    })

    return { success: true, data: media }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  try {
    await requirePermission('gallery:delete')
    await prisma.media.delete({ where: { id } })
    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}
