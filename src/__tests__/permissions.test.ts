import { describe, it, expect } from 'vitest'
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  isStaff,
} from '@/lib/auth/permissions'
import { UserRole } from '@prisma/client'

describe('RBAC Permissions', () => {
  it('SUPER_ADMIN has specific permissions', () => {
    expect(hasPermission(UserRole.SUPER_ADMIN, 'settings:write')).toBe(true)
    expect(hasPermission(UserRole.SUPER_ADMIN, 'farmers:delete')).toBe(true)
  })

  it('FARMER does not have write permissions', () => {
    expect(hasPermission(UserRole.FARMER, 'farmers:read')).toBe(true)
    expect(hasPermission(UserRole.FARMER, 'farmers:write')).toBe(false)
    expect(hasPermission(UserRole.FARMER, 'dashboard:read')).toBe(false)
  })

  it('hasAnyPermission works correctly', () => {
    expect(
      hasAnyPermission(UserRole.SUPPORT_STAFF, ['settings:write', 'leads:write'])
    ).toBe(true)
    expect(
      hasAnyPermission(UserRole.SUPPORT_STAFF, ['settings:write', 'farmers:delete'])
    ).toBe(false)
  })

  it('hasAllPermissions works correctly', () => {
    expect(
      hasAllPermissions(UserRole.FINANCE_OFFICER, ['financing:read', 'financing:write'])
    ).toBe(true)
    expect(
      hasAllPermissions(UserRole.FINANCE_OFFICER, ['financing:read', 'farmers:write'])
    ).toBe(false)
  })

  it('isAdmin identifies admins correctly', () => {
    expect(isAdmin(UserRole.SUPER_ADMIN)).toBe(true)
    expect(isAdmin(UserRole.ADMIN)).toBe(true)
    expect(isAdmin(UserRole.SUPPORT_STAFF)).toBe(false)
    expect(isAdmin(UserRole.FARMER)).toBe(false)
  })

  it('isStaff identifies internal staff correctly', () => {
    expect(isStaff(UserRole.SUPER_ADMIN)).toBe(true)
    expect(isStaff(UserRole.SUPPORT_STAFF)).toBe(true)
    expect(isStaff(UserRole.FARMER)).toBe(false)
  })
})
