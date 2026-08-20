'use client'

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`
          relative w-full ${sizeStyles[size]}
          bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.08)]
          shadow-card animate-fade-in
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 pb-0">
            <div>
              {title && (
                <h3 className="text-xl font-bold font-heading text-brand-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-brand-muted">{description}</p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-md text-brand-muted hover:text-brand-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// Confirm dialog helper
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}) {
  const buttonStyles = {
    danger:
      'bg-error text-brand-white hover:brightness-110',
    primary:
      'bg-gradient-brand text-brand-dark-deep hover:brightness-110',
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-brand-light-gray mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-md text-brand-light-gray bg-brand-dark border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] transition-colors disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 disabled:opacity-50 ${buttonStyles[variant]}`}
        >
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
