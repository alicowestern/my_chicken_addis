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
import { updateSettingSchema } from '@/lib/validations'
import type { AuditLog, WebsiteSetting } from '@prisma/client'

// ============================================================
// AUDIT LOG
// ============================================================

type AuditLogWithUser = Omit<AuditLog, 'details'> & {
  user: { name: string; email: string } | null
  details: unknown
}

export async function getAuditLogs(
  params: PaginationParams & { entity?: string }
): Promise<ActionResult<PaginatedResult<AuditLogWithUser>>> {
  try {
    await requirePermission('audit:read')
    const { page, limit, skip, search } = parsePagination(params)

    const where: Record<string, unknown> = {}

    if (params.entity && params.entity !== 'ALL') {
      where.entity = params.entity
    }

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { entity: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      success: true,
      data: { items: items as AuditLogWithUser[], meta: buildPaginationMeta(total, page, limit) },
    }
  } catch (error) {
    return handleActionError(error)
  }
}

// ============================================================
// WEBSITE SETTINGS
// ============================================================

export async function getWebsiteSettings(): Promise<ActionResult<WebsiteSetting[]>> {
  try {
    await requirePermission('settings:read')

    const settings = await prisma.websiteSetting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    })

    return { success: true, data: settings }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateWebsiteSetting(formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission('settings:write')

    const raw = Object.fromEntries(formData.entries())
    const parsed = updateSettingSchema.parse(raw)

    await prisma.websiteSetting.upsert({
      where: { key: parsed.key },
      update: { value: parsed.value },
      create: {
        key: parsed.key,
        value: parsed.value,
        group: (raw.group as string) || 'general',
      },
    })

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateWebsiteSettingsBatch(formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission('settings:write')

    const entries = Object.fromEntries(formData.entries())
    const group = (entries._group as string) || 'general'

    // All entries except _group are key-value pairs
    const updates = Object.entries(entries)
      .filter(([key]) => !key.startsWith('_'))
      .map(([key, value]) => ({
        key,
        value: String(value),
        group,
      }))

    await prisma.$transaction(
      updates.map((setting) =>
        prisma.websiteSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: setting,
        })
      )
    )

    return { success: true, data: undefined }
  } catch (error) {
    return handleActionError(error)
  }
}
