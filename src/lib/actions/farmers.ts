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
import { createFarmerSchema, updateFarmerSchema } from '@/lib/validations'
import type { Farmer } from '@prisma/client'

// ============================================================
// GET FARMERS (Paginated)
// ============================================================

export async function getFarmers(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<Farmer>>> {
  try {
    await requirePermission('farmers:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { farmerId: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.farmer.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.farmer.count({ where }),
    ])

    return {
      success: true,
      data: {
        items,
        meta: buildPaginationMeta(total, page, limit),
      },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET FARMER BY ID
// ============================================================

export async function getFarmerById(id: string): Promise<ActionResult<Farmer>> {
  try {
    await requirePermission('farmers:read')

    const farmer = await prisma.farmer.findUnique({
      where: { id },
      include: {
        birdOrders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        feedOrders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        trainingRegistrations: {
          include: { course: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        financingApplications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!farmer) {
      return { success: false, error: 'Farmer not found' }
    }

    return { success: true, data: farmer }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// CREATE FARMER
// ============================================================

export async function createFarmer(formData: FormData): Promise<ActionResult<Farmer>> {
  try {
    await requirePermission('farmers:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = createFarmerSchema.parse(raw)

    const farmer = await prisma.farmer.create({
      data: {
        ...parsed,
        email: parsed.email || null,
      },
    })

    return { success: true, data: farmer }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE FARMER
// ============================================================

export async function updateFarmer(id: string, formData: FormData): Promise<ActionResult<Farmer>> {
  try {
    await requirePermission('farmers:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateFarmerSchema.parse(raw)

    const farmer = await prisma.farmer.update({
      where: { id },
      data: {
        ...parsed,
        email: parsed.email || null,
      },
    })

    return { success: true, data: farmer }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// DELETE FARMER (Soft Delete)
// ============================================================

export async function deleteFarmer(id: string): Promise<ActionResult> {
  try {
    await requirePermission('farmers:delete')

    await prisma.farmer.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET FARMER STATS
// ============================================================

export async function getFarmerStats(): Promise<ActionResult<{
  total: number
  active: number
  prospect: number
  inactive: number
}>> {
  try {
    await requirePermission('farmers:read')

    const [total, active, prospect, inactive] = await Promise.all([
      prisma.farmer.count({ where: { deletedAt: null } }),
      prisma.farmer.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.farmer.count({ where: { status: 'PROSPECT', deletedAt: null } }),
      prisma.farmer.count({ where: { status: 'INACTIVE', deletedAt: null } }),
    ])

    return { success: true, data: { total, active, prospect, inactive } }
  } catch (error) {
    return handleActionError(error)
  }
}
