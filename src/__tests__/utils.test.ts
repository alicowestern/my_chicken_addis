import { describe, it, expect } from 'vitest'
import {
  parsePagination,
  buildPaginationMeta,
  handleActionError,
} from '@/lib/actions/utils'

describe('Action Utils', () => {
  describe('Pagination Helpers', () => {
    it('parsePagination handles missing params gracefully', () => {
      const result = parsePagination({})
      expect(result).toEqual({
        page: 1,
        limit: 10,
        skip: 0,
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
    })

    it('parsePagination enforces minimums', () => {
      const result = parsePagination({ page: -5, limit: 0 })
      expect(result.page).toBe(1)
      expect(result.limit).toBe(1)
      expect(result.skip).toBe(0)
    })

    it('buildPaginationMeta calculates correctly', () => {
      const meta = buildPaginationMeta(45, 2, 10)
      expect(meta).toEqual({
        page: 2,
        limit: 10,
        total: 45,
        totalPages: 5,
        hasNext: true,
        hasPrev: true,
      })
    })
  })

  describe('Error Handling', () => {
    it('handleActionError returns safe messages for random errors', () => {
      const result = handleActionError(new Error('Some internal DB explosion'))
      expect(result).toEqual({
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      })
    })

    it('handleActionError exposes auth and permission errors', () => {
      const result = handleActionError(new Error('Authentication required'))
      expect(result).toEqual({
        success: false,
        error: 'Authentication required',
      })
    })
  })
})
