'use server'

import { auth } from '@/lib/auth/auth'
import { hasPermission, type Permission } from '@/lib/auth/permissions'
import type { UserRole } from '@prisma/client'

// ============================================================
// TYPES
// ============================================================

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type PaginatedResult<T> = {
  items: T[]
  meta: PaginationMeta
}

export type PaginationParams = {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ============================================================
// AUTH HELPERS
// ============================================================

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  return session.user
}

export async function requirePermission(permission: Permission) {
  const user = await requireAuth()
  if (!hasPermission(user.role as UserRole, permission)) {
    throw new Error('You do not have permission to perform this action')
  }
  return user
}

export async function requireAnyPermission(permissions: Permission[]) {
  const user = await requireAuth()
  const hasAny = permissions.some((p) => hasPermission(user.role as UserRole, p))
  if (!hasAny) {
    throw new Error('You do not have permission to perform this action')
  }
  return user
}

// ============================================================
// PAGINATION HELPERS
// ============================================================

export function parsePagination(params: PaginationParams) {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 10))
  const skip = (page - 1) * limit
  const search = params.search?.trim() || ''
  const sortBy = params.sortBy || 'createdAt'
  const sortOrder = params.sortOrder || 'desc'

  return { page, limit, skip, search, sortBy, sortOrder }
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

// ============================================================
// ERROR HANDLING
// ============================================================

export function handleActionError(error: unknown): ActionResult<never> {
  console.error('Action error:', error)

  if (error instanceof Error) {
    // Don't expose internal errors to the client
    if (
      error.message.includes('Authentication required') ||
      error.message.includes('permission')
    ) {
      return { success: false, error: error.message }
    }

    // Prisma unique constraint violation
    if (error.message.includes('Unique constraint')) {
      return { success: false, error: 'A record with this value already exists.' }
    }

    // Prisma record not found
    if (error.message.includes('Record to update not found') || error.message.includes('Record to delete does not exist')) {
      return { success: false, error: 'Record not found.' }
    }
  }

  return { success: false, error: 'An unexpected error occurred. Please try again.' }
}
