'use server'

import { prisma } from '@/lib/database/prisma'
import { requirePermission } from '@/lib/actions/utils'

// ============================================================
// DASHBOARD DATA FETCHERS
// ============================================================

export type DashboardStats = {
  totalFarmers: number
  activeBirdOrders: number
  feedStockBags: number
  pendingFinancing: number
  newLeads: number
}

export type RecentOrder = {
  id: string
  orderNumber: string
  customerName: string | null
  status: string
  totalAmount: unknown
  createdAt: Date
}

export type RecentLead = {
  id: string
  name: string
  type: string
  status: string
  createdAt: Date
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    await requirePermission('dashboard:read')

    const [
      totalFarmers,
      activeBirdOrders,
      feedStockResult,
      pendingFinancing,
      newLeads,
    ] = await Promise.all([
      prisma.farmer.count({ where: { deletedAt: null } }),
      prisma.birdOrder.count({
        where: {
          status: { in: ['NEW', 'CONFIRMED', 'PREPARING', 'READY'] },
          deletedAt: null,
        },
      }),
      prisma.feedProduct.aggregate({
        _sum: { stockQuantity: true },
        where: { deletedAt: null, status: { not: 'DISCONTINUED' } },
      }),
      prisma.financingApplication.count({
        where: {
          status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED'] },
          deletedAt: null,
        },
      }),
      prisma.lead.count({
        where: { status: 'NEW', deletedAt: null },
      }),
    ])

    return {
      totalFarmers,
      activeBirdOrders,
      feedStockBags: feedStockResult._sum.stockQuantity ?? 0,
      pendingFinancing,
      newLeads,
    }
  } catch {
    return {
      totalFarmers: 0,
      activeBirdOrders: 0,
      feedStockBags: 0,
      pendingFinancing: 0,
      newLeads: 0,
    }
  }
}

export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  try {
    await requirePermission('orders:read')

    return await prisma.birdOrder.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  } catch {
    return []
  }
}

export async function getRecentLeads(limit = 5): Promise<RecentLead[]> {
  try {
    await requirePermission('leads:read')

    return await prisma.lead.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  } catch {
    return []
  }
}
