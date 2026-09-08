'use client'

import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Spinner } from './index'

// ============================================================
// TYPES
// ============================================================

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  className?: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  // Pagination
  page?: number
  totalPages?: number
  total?: number
  onPageChange?: (page: number) => void
  // Search
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  // Sorting
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
  // Row actions
  onRowClick?: (item: T) => void
  rowActions?: (item: T) => React.ReactNode
  // Empty state
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  // Header actions
  headerActions?: React.ReactNode
  // Identity
  keyExtractor?: (item: T) => string
}

// ============================================================
// COMPONENT
// ============================================================

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  rowActions,
  emptyTitle = 'No data found',
  emptyDescription = 'No records match your search criteria.',
  emptyAction,
  headerActions,
  keyExtractor,
}: DataTableProps<T>) {
  const [actionsOpenIndex, setActionsOpenIndex] = useState<number | null>(null)

  const getKey = (item: T, index: number) => {
    if (keyExtractor) return keyExtractor(item)
    if ('id' in item) return String(item.id)
    return String(index)
  }

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
    return sortOrder === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-brand-cyan" />
      : <ArrowDown className="w-3.5 h-3.5 text-brand-cyan" />
  }

  const getCellValue = (item: T, key: string): React.ReactNode => {
    const value = key.split('.').reduce((obj: unknown, k: string) => {
      if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k]
      return undefined
    }, item)
    if (value === null || value === undefined) return '—'
    if (value instanceof Date) return value.toLocaleDateString()
    return String(value)
  }

  return (
    <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden shadow-card">
      {/* ---- Header / Search / Actions ---- */}
      <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)] bg-brand-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search */}
        {onSearchChange && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-brand-surface border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-brand-white placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 focus:border-brand-cyan transition-all"
            />
          </div>
        )}

        {/* Right-side actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {total > 0 && (
            <span className="text-xs text-brand-muted">
              {total} record{total !== 1 ? 's' : ''}
            </span>
          )}
          {headerActions}
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.sortable && onSort ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-brand-cyan transition-colors"
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {rowActions && (
                <th className="px-6 py-3 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-16">
                  <div className="flex items-center justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActions ? 1 : 0)} className="py-16">
                  <div className="text-center">
                    <p className="text-brand-white font-medium">{emptyTitle}</p>
                    <p className="text-sm text-brand-muted mt-1">{emptyDescription}</p>
                    {emptyAction && <div className="mt-4">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={getKey(item, index)}
                  className={`
                    hover:bg-[rgba(79,195,247,0.03)] transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-4 text-sm text-brand-light-gray whitespace-nowrap ${col.className || ''}`}>
                      {col.render ? col.render(item) : getCellValue(item, col.key)}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-6 py-4 text-right relative">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActionsOpenIndex(actionsOpenIndex === index ? null : index)
                          }}
                          className="p-1 rounded-md text-brand-muted hover:text-brand-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {actionsOpenIndex === index && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActionsOpenIndex(null)
                              }}
                            />
                            <div className="absolute right-0 top-full mt-1 z-20 bg-brand-dark border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg py-1 min-w-[140px]">
                              <div onClick={() => setActionsOpenIndex(null)}>
                                {rowActions(item)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Pagination ---- */}
      {totalPages > 1 && onPageChange && (
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between bg-brand-dark">
          <p className="text-xs text-brand-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              className="p-1.5 rounded-md text-brand-muted hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.05)] disabled:opacity-30 disabled:hover:text-brand-muted disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-md text-brand-muted hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.05)] disabled:opacity-30 disabled:hover:text-brand-muted disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`
                    w-8 h-8 rounded-md text-xs font-medium transition-colors
                    ${pageNum === page
                      ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30'
                      : 'text-brand-muted hover:text-brand-white hover:bg-[rgba(255,255,255,0.05)]'
                    }
                  `}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md text-brand-muted hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.05)] disabled:opacity-30 disabled:hover:text-brand-muted disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md text-brand-muted hover:text-brand-cyan hover:bg-[rgba(79,195,247,0.05)] disabled:opacity-30 disabled:hover:text-brand-muted disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// ROW ACTION HELPERS
// ============================================================

export function RowAction({
  label,
  icon,
  onClick,
  variant = 'default',
}: {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`
        w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors
        ${variant === 'danger'
          ? 'text-error hover:bg-error/5'
          : 'text-brand-light-gray hover:bg-[rgba(255,255,255,0.05)] hover:text-brand-white'
        }
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </button>
  )
}
