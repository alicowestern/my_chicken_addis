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
import { createBirdProductSchema, updateBirdProductSchema } from '@/lib/validations'
import type { BirdProduct } from '@prisma/client'

// ============================================================
// GET BIRD PRODUCTS (Paginated)
// ============================================================

export async function getBirdProducts(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<BirdProduct>>> {
  try {
    await requirePermission('birds:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { birdType: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.birdProduct.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.birdProduct.count({ where }),
    ])

    return {
      success: true,
      data: { items, meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET BIRD PRODUCT BY ID
// ============================================================

export async function getBirdProductById(id: string): Promise<ActionResult<BirdProduct>> {
  try {
    await requirePermission('birds:read')

    const product = await prisma.birdProduct.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { order: true },
          orderBy: { order: { createdAt: 'desc' } },
          take: 20,
        },
      },
    })

    if (!product) {
      return { success: false, error: 'Bird product not found' }
    }

    return { success: true, data: product }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// CREATE BIRD PRODUCT
// ============================================================

export async function createBirdProduct(formData: FormData): Promise<ActionResult<BirdProduct>> {
  try {
    await requirePermission('birds:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = createBirdProductSchema.parse(raw)

    const product = await prisma.birdProduct.create({
      data: parsed,
    })

    return { success: true, data: product }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE BIRD PRODUCT
// ============================================================

export async function updateBirdProduct(id: string, formData: FormData): Promise<ActionResult<BirdProduct>> {
  try {
    await requirePermission('birds:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateBirdProductSchema.parse(raw)

    const product = await prisma.birdProduct.update({
      where: { id },
      data: parsed,
    })

    return { success: true, data: product }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// DELETE BIRD PRODUCT (Soft Delete)
// ============================================================

export async function deleteBirdProduct(id: string): Promise<ActionResult> {
  try {
    await requirePermission('birds:delete')

    await prisma.birdProduct.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

