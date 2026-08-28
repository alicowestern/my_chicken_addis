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
import { createEventSchema, updateEventSchema } from '@/lib/validations'
import type { Event, EventRegistration } from '@prisma/client'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ============================================================
// GET EVENTS (Paginated)
// ============================================================

export async function getEvents(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<Event & { _count: { registrations: number } }>>> {
  try {
    await requirePermission('events:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = { deletedAt: null }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { organizer: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { _count: { select: { registrations: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return {
      success: true,
      data: { items: items as (Event & { _count: { registrations: number } })[], meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET EVENT BY ID
// ============================================================

export async function getEventById(id: string): Promise<ActionResult<Event & { registrations: EventRegistration[] }>> {
  try {
    await requirePermission('events:read')

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!event) {
      return { success: false, error: 'Event not found' }
    }

    return { success: true, data: event }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// CREATE EVENT
// ============================================================

export async function createEvent(formData: FormData): Promise<ActionResult<Event>> {
  try {
    await requirePermission('events:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = createEventSchema.parse(raw)

    // Generate unique slug
    let slug = generateSlug(parsed.title)
    const existing = await prisma.event.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const event = await prisma.event.create({
      data: {
        title: parsed.title,
        slug,
        description: parsed.description || null,
        eventType: parsed.eventType || null,
        date: new Date(parsed.date),
        startTime: parsed.startTime || null,
        endTime: parsed.endTime || null,
        location: parsed.location || null,
        organizer: parsed.organizer || null,
        featuredImage: (raw.featuredImage as string) || null,
        status: parsed.status,
      },
    })

    return { success: true, data: event }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE EVENT
// ============================================================

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult<Event>> {
  try {
    await requirePermission('events:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateEventSchema.parse(raw)

    const data: Record<string, unknown> = {}
    if (parsed.title) data.title = parsed.title
    if (parsed.description !== undefined) data.description = parsed.description || null
    if (parsed.eventType !== undefined) data.eventType = parsed.eventType || null
    if (parsed.date) data.date = new Date(parsed.date)
    if (parsed.startTime !== undefined) data.startTime = parsed.startTime || null
    if (parsed.endTime !== undefined) data.endTime = parsed.endTime || null
    if (parsed.location !== undefined) data.location = parsed.location || null
    if (parsed.organizer !== undefined) data.organizer = parsed.organizer || null
    if (parsed.status) data.status = parsed.status
    if (raw.featuredImage !== undefined) data.featuredImage = (raw.featuredImage as string) || null

    const event = await prisma.event.update({
      where: { id },
      data,
    })

    return { success: true, data: event }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// DELETE EVENT (Soft Delete)
// ============================================================

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    await requirePermission('events:delete')

    await prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}
