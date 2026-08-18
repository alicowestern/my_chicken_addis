import { type UserRole } from '@prisma/client'

export type Permission =
  | 'farmers:read'
  | 'farmers:write'
  | 'farmers:delete'
  | 'birds:read'
  | 'birds:write'
  | 'birds:delete'
  | 'feed:read'
  | 'feed:write'
  | 'feed:delete'
  | 'orders:read'
  | 'orders:write'
  | 'orders:delete'
  | 'training:read'
  | 'training:write'
  | 'training:delete'
  | 'financing:read'
  | 'financing:write'
  | 'financing:delete'
  | 'blog:read'
  | 'blog:write'
  | 'blog:delete'
  | 'events:read'
  | 'events:write'
  | 'events:delete'
  | 'gallery:read'
  | 'gallery:write'
  | 'gallery:delete'
  | 'faqs:read'
  | 'faqs:write'
  | 'faqs:delete'
  | 'testimonials:read'
  | 'testimonials:write'
  | 'testimonials:delete'
  | 'leads:read'
  | 'leads:write'
  | 'leads:delete'
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'settings:read'
  | 'settings:write'
  | 'reports:read'
  | 'reports:export'
  | 'audit:read'
  | 'dashboard:read'

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'farmers:read', 'farmers:write', 'farmers:delete',
    'birds:read', 'birds:write', 'birds:delete',
    'feed:read', 'feed:write', 'feed:delete',
    'orders:read', 'orders:write', 'orders:delete',
    'training:read', 'training:write', 'training:delete',
    'financing:read', 'financing:write', 'financing:delete',
    'blog:read', 'blog:write', 'blog:delete',
    'events:read', 'events:write', 'events:delete',
    'gallery:read', 'gallery:write', 'gallery:delete',
    'faqs:read', 'faqs:write', 'faqs:delete',
    'testimonials:read', 'testimonials:write', 'testimonials:delete',
    'leads:read', 'leads:write', 'leads:delete',
    'users:read', 'users:write', 'users:delete',
    'settings:read', 'settings:write',
    'reports:read', 'reports:export',
    'audit:read',
    'dashboard:read',
  ],
  ADMIN: [
    'farmers:read', 'farmers:write',
    'birds:read', 'birds:write',
    'feed:read', 'feed:write',
    'orders:read', 'orders:write',
    'training:read', 'training:write',
    'financing:read', 'financing:write',
    'blog:read', 'blog:write',
    'events:read', 'events:write',
    'gallery:read', 'gallery:write',
    'faqs:read', 'faqs:write',
    'testimonials:read', 'testimonials:write',
    'leads:read', 'leads:write',
    'reports:read', 'reports:export',
    'dashboard:read',
  ],
  FINANCE_OFFICER: [
    'financing:read', 'financing:write',
    'farmers:read',
    'reports:read',
    'dashboard:read',
  ],
  TRAINING_MANAGER: [
    'training:read', 'training:write',
    'events:read', 'events:write',
    'farmers:read',
    'reports:read',
    'dashboard:read',
  ],
  SUPPORT_STAFF: [
    'leads:read', 'leads:write',
    'farmers:read',
    'orders:read', 'orders:write',
    'birds:read',
    'feed:read',
    'dashboard:read',
  ],
  CONTENT_MANAGER: [
    'blog:read', 'blog:write',
    'events:read', 'events:write',
    'gallery:read', 'gallery:write',
    'faqs:read', 'faqs:write',
    'testimonials:read', 'testimonials:write',
    'dashboard:read',
  ],
  FARMER: [
    'farmers:read',
    'birds:read',
    'feed:read',
    'training:read',
    'financing:read',
    'orders:read',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? []
}

export function isAdmin(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function isStaff(role: UserRole): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'FINANCE_OFFICER', 'TRAINING_MANAGER', 'SUPPORT_STAFF', 'CONTENT_MANAGER'].includes(role)
}
