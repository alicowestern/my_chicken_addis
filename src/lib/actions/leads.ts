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
import { updateLeadSchema } from '@/lib/validations'

// ============================================================
// TYPES
// ============================================================

type LeadWithRelations = {
  id: string
  name: string
  phone: string | null
  email: string | null
  location: string | null
  type: string
  subject: string | null
  message: string | null
  status: string
  notes: string | null
  assignedStaffId: string | null
  assignedStaff: { name: string; email: string } | null
  birdOrder: { id: string; orderNumber: string; status: string } | null
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// GET LEADS (Paginated)
// ============================================================

export async function getLeads(
  params: PaginationParams & { status?: string; type?: string }
): Promise<ActionResult<PaginatedResult<LeadWithRelations>>> {
  try {
    await requirePermission('leads:read')
    const { page, limit, skip, search, sortBy, sortOrder } = parsePagination(params)

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (params.type && params.type !== 'ALL') {
      where.type = params.type
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedStaff: { select: { name: true, email: true } },
          birdOrder: { select: { id: true, orderNumber: true, status: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    return {
      success: true,
      data: { items: items as unknown as LeadWithRelations[], meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET LEAD BY ID
// ============================================================

export async function getLeadById(id: string): Promise<ActionResult<LeadWithRelations>> {
  try {
    await requirePermission('leads:read')

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedStaff: { select: { name: true, email: true } },
        birdOrder: { select: { id: true, orderNumber: true, status: true } },
      },
    })

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    return { success: true, data: lead as unknown as LeadWithRelations }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// UPDATE LEAD
// ============================================================

export async function updateLead(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission('leads:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateLeadSchema.parse(raw)

    const data: Record<string, unknown> = {}
    if (parsed.status) data.status = parsed.status
    if (parsed.notes !== undefined) data.notes = parsed.notes || null
    if (parsed.assignedStaffId !== undefined) data.assignedStaffId = parsed.assignedStaffId || null

    await prisma.lead.update({
      where: { id },
      data,
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// DELETE LEAD (Soft Delete)
// ============================================================

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    await requirePermission('leads:delete')

    await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// GET STAFF FOR ASSIGNMENT
// ============================================================

export async function getStaffMembers(): Promise<ActionResult<{ id: string; name: string; role: string }[]>> {
  try {
    await requirePermission('leads:read')

    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT_STAFF'] },
        status: 'ACTIVE',
      },
      select: { id: true, name: true, role: true },
      orderBy: { name: 'asc' },
    })

    return { success: true, data: staff }
  } catch (error) {
    return handleActionError(error)
  }
}
