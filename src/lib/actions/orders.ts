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
import { updateOrderStatusSchema } from '@/lib/validations'

// ============================================================
// TYPES
// ============================================================

type BirdOrderWithRelations = {
  id: string
  orderNumber: string
  customerName: string | null
  customerPhone: string | null
  customerEmail: string | null
  customerLocation: string | null
  status: string
  deliveryMethod: string
  totalAmount: unknown
  orderDate: Date
  createdAt: Date
  farmer: { fullName: string; farmerId: string } | null
  items: { id: string; quantity: number; unitPrice: unknown; total: unknown; product: { name: string; birdType: string } }[]
}

type FeedOrderWithRelations = {
  id: string
  orderNumber: string
  customerName: string | null
  customerPhone: string | null
  status: string
  deliveryMethod: string
  totalAmount: unknown
  orderDate: Date
  createdAt: Date
  farmer: { fullName: string; farmerId: string } | null
  items: { id: string; quantity: number; unitPrice: unknown; total: unknown; product: { name: string; category: string } }[]
}

// ============================================================
// GET BIRD ORDERS (Paginated)
// ============================================================

export async function getBirdOrders(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<BirdOrderWithRelations>>> {
  try {
    await requirePermission('orders:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.birdOrder.findMany({
        where,
        include: {
          farmer: { select: { fullName: true, farmerId: true } },
          items: {
            include: { product: { select: { name: true, birdType: true } } },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.birdOrder.count({ where }),
    ])

    return {
      success: true,
      data: { items: items as unknown as BirdOrderWithRelations[], meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET BIRD ORDER BY ID
// ============================================================

export async function getBirdOrderById(id: string): Promise<ActionResult<BirdOrderWithRelations>> {
  try {
    await requirePermission('orders:read')

    const order = await prisma.birdOrder.findUnique({
      where: { id },
      include: {
        farmer: { select: { fullName: true, farmerId: true, phone: true, email: true, location: true } },
        items: {
          include: { product: true },
        },
        lead: true,
      },
    })

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    return { success: true, data: order as unknown as BirdOrderWithRelations }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE BIRD ORDER STATUS
// ============================================================

export async function updateBirdOrderStatus(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission('orders:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateOrderStatusSchema.parse(raw)

    await prisma.birdOrder.update({
      where: { id },
      data: {
        status: parsed.status,
        notes: parsed.notes,
      },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET FEED ORDERS (Paginated)
// ============================================================

export async function getFeedOrders(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<FeedOrderWithRelations>>> {
  try {
    await requirePermission('orders:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.feedOrder.findMany({
        where,
        include: {
          farmer: { select: { fullName: true, farmerId: true } },
          items: {
            include: { product: { select: { name: true, category: true } } },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.feedOrder.count({ where }),
    ])

    return {
      success: true,
      data: { items: items as unknown as FeedOrderWithRelations[], meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE FEED ORDER STATUS
// ============================================================

export async function updateFeedOrderStatus(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission('orders:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateOrderStatusSchema.parse(raw)

    await prisma.feedOrder.update({
      where: { id },
      data: {
        status: parsed.status,
        notes: parsed.notes,
      },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// ORDER STATS
// ============================================================

export async function getOrderStats(): Promise<ActionResult<{
  birdOrders: { total: number; pending: number; completed: number }
  feedOrders: { total: number; pending: number; completed: number }
}>> {
  try {
    await requirePermission('orders:read')

    const [birdTotal, birdPending, birdCompleted, feedTotal, feedPending, feedCompleted] = await Promise.all([
      prisma.birdOrder.count({ where: { deletedAt: null } }),
      prisma.birdOrder.count({ where: { status: { in: ['NEW', 'CONFIRMED', 'PREPARING'] }, deletedAt: null } }),
      prisma.birdOrder.count({ where: { status: 'COMPLETED', deletedAt: null } }),
      prisma.feedOrder.count({ where: { deletedAt: null } }),
      prisma.feedOrder.count({ where: { status: { in: ['NEW', 'CONFIRMED', 'PREPARING'] }, deletedAt: null } }),
      prisma.feedOrder.count({ where: { status: 'COMPLETED', deletedAt: null } }),
    ])

    return {
      success: true,
      data: {
        birdOrders: { total: birdTotal, pending: birdPending, completed: birdCompleted },
        feedOrders: { total: feedTotal, pending: feedPending, completed: feedCompleted },
      },
    }
  } catch (error) {
    return handleActionError(error)
  }
}
