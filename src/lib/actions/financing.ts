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
import type { FinancingApplication } from '@prisma/client'

// ============================================================
// TYPES
// ============================================================

type FinancingApplicationWithRelations = FinancingApplication & {
  farmer: { fullName: string; farmerId: string; phone: string } | null
  partner: { name: string } | null
  assignedOfficer: { name: string; email: string } | null
}

// ============================================================
// GET FINANCING APPLICATIONS (Paginated)
// ============================================================

export async function getFinancingApplications(
  params: PaginationParams & { status?: string }
): Promise<ActionResult<PaginatedResult<FinancingApplicationWithRelations>>> {
  try {
    await requirePermission('financing:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = { deletedAt: null }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (search) {
      where.OR = [
        { applicationNumber: { contains: search, mode: 'insensitive' } },
        { applicantName: { contains: search, mode: 'insensitive' } },
        { applicantPhone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.financingApplication.findMany({
        where,
        include: {
          farmer: { select: { fullName: true, farmerId: true, phone: true } },
          partner: { select: { name: true } },
          assignedOfficer: { select: { name: true, email: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.financingApplication.count({ where }),
    ])

    return {
      success: true,
      data: { items: items as unknown as FinancingApplicationWithRelations[], meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET FINANCING APPLICATION BY ID
// ============================================================

export async function getFinancingApplicationById(id: string): Promise<ActionResult<FinancingApplicationWithRelations>> {
  try {
    await requirePermission('financing:read')

    const app = await prisma.financingApplication.findUnique({
      where: { id },
      include: {
        farmer: { select: { fullName: true, farmerId: true, phone: true } },
        partner: { select: { name: true } },
        assignedOfficer: { select: { name: true, email: true } },
        documents: true,
      },
    })

    if (!app) {
      return { success: false, error: 'Application not found' }
    }

    return { success: true, data: app as unknown as FinancingApplicationWithRelations }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE FINANCING APPLICATION STATUS
// ============================================================

export async function updateFinancingApplication(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission('financing:write')

    const raw = Object.fromEntries(formData.entries())

    const data: Record<string, unknown> = {}
    if (raw.status) data.status = raw.status
    if (raw.notes !== undefined) data.notes = (raw.notes as string) || null
    if (raw.assignedOfficerId !== undefined) data.assignedOfficerId = (raw.assignedOfficerId as string) || null
    if (raw.referralInfo !== undefined) data.referralInfo = (raw.referralInfo as string) || null

    await prisma.financingApplication.update({
      where: { id },
      data,
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET FINANCING STATS
// ============================================================

export async function getFinancingStats(): Promise<ActionResult<{
  total: number
  submitted: number
  underReview: number
  approved: number
  rejected: number
}>> {
  try {
    await requirePermission('financing:read')

    const [total, submitted, underReview, approved, rejected] = await Promise.all([
      prisma.financingApplication.count({ where: { deletedAt: null } }),
      prisma.financingApplication.count({ where: { status: 'SUBMITTED', deletedAt: null } }),
      prisma.financingApplication.count({ where: { status: 'UNDER_REVIEW', deletedAt: null } }),
      prisma.financingApplication.count({ where: { status: 'APPROVED', deletedAt: null } }),
      prisma.financingApplication.count({ where: { status: 'REJECTED', deletedAt: null } }),
    ])

    return { success: true, data: { total, submitted, underReview, approved, rejected } }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET FINANCE OFFICERS FOR ASSIGNMENT
// ============================================================

export async function getFinanceOfficers(): Promise<ActionResult<{ id: string; name: string }[]>> {
  try {
    await requirePermission('financing:read')

    const officers = await prisma.user.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_OFFICER'] },
        status: 'ACTIVE',
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })

    return { success: true, data: officers }
  } catch (error) {
    return handleActionError(error)
  }
}
