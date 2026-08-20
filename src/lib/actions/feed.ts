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
import { createFeedProductSchema, updateFeedProductSchema, addFeedInventorySchema } from '@/lib/validations'
import type { FeedProduct } from '@prisma/client'

// ============================================================
// GET FEED PRODUCTS (Paginated)
// ============================================================

export async function getFeedProducts(
  params: PaginationParams & { status?: string; category?: string }
): Promise<ActionResult<PaginatedResult<FeedProduct>>> {
  try {
    await requirePermission('feed:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (params.category && params.category !== 'ALL') {
      where.category = params.category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.feedProduct.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.feedProduct.count({ where }),
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
// GET FEED PRODUCT BY ID
// ============================================================

export async function getFeedProductById(id: string): Promise<ActionResult<FeedProduct & { inventory: unknown[] }>> {
  try {
    await requirePermission('feed:read')

    const product = await prisma.feedProduct.findUnique({
      where: { id },
      include: {
        inventory: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        orderItems: {
          include: { order: true },
          orderBy: { order: { createdAt: 'desc' } },
          take: 20,
        },
      },
    })

    if (!product) {
      return { success: false, error: 'Feed product not found' }
    }

    return { success: true, data: product }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// CREATE FEED PRODUCT
// ============================================================

export async function createFeedProduct(formData: FormData): Promise<ActionResult<FeedProduct>> {
  try {
    await requirePermission('feed:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = createFeedProductSchema.parse(raw)

    const product = await prisma.feedProduct.create({
      data: parsed,
    })

    return { success: true, data: product }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE FEED PRODUCT
// ============================================================

export async function updateFeedProduct(id: string, formData: FormData): Promise<ActionResult<FeedProduct>> {
  try {
    await requirePermission('feed:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateFeedProductSchema.parse(raw)

    const product = await prisma.feedProduct.update({
      where: { id },
      data: parsed,
    })

    return { success: true, data: product }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// DELETE FEED PRODUCT (Soft Delete)
// ============================================================

export async function deleteFeedProduct(id: string): Promise<ActionResult> {
  try {
    await requirePermission('feed:delete')

    await prisma.feedProduct.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// ADD FEED INVENTORY
// ============================================================

export async function addFeedInventory(formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission('feed:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = addFeedInventorySchema.parse(raw)

    await prisma.$transaction(async (tx) => {
      // Create inventory record
      await tx.feedInventory.create({
        data: parsed,
      })

      // Update stock quantity
      const quantityChange = parsed.type === 'RECEIVED'
        ? parsed.quantity
        : parsed.type === 'SOLD'
          ? -parsed.quantity
          : parsed.quantity // ADJUSTMENT uses the signed value

      await tx.feedProduct.update({
        where: { id: parsed.productId },
        data: {
          stockQuantity: {
            increment: quantityChange,
          },
        },
      })
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET AVAILABLE FEED PRODUCTS (Public - no auth)
// ============================================================

export async function getAvailableFeedProducts(): Promise<ActionResult<FeedProduct[]>> {
  try {
    const products = await prisma.feedProduct.findMany({
      where: {
        deletedAt: null,
        status: { in: ['AVAILABLE', 'LOW_STOCK'] },
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    })

    return { success: true, data: products }
  } catch (error) {
    return handleActionError(error)
  }
}
