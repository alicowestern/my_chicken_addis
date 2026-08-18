import React from 'react'

type BadgeVariant = 'available' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'info' | 'success' | 'warning' | 'error'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export default function Badge({ children, variant = 'info', className = '' }: BadgeProps) {
  // Map standard variants + the specific ones from brand guidelines
  const variants = {
    available: 'bg-[rgba(79,195,247,0.1)] text-brand-cyan border border-brand-cyan/20',
    pending: 'bg-[rgba(255,167,38,0.1)] text-warning border border-warning/20',
    completed: 'bg-[rgba(102,187,106,0.1)] text-success border border-success/20',
    cancelled: 'bg-[rgba(239,83,80,0.1)] text-error border border-error/20',
    draft: 'bg-brand-surface text-brand-muted border border-[rgba(255,255,255,0.1)]',
    info: 'bg-[rgba(79,195,247,0.1)] text-brand-cyan border border-brand-cyan/20',
    success: 'bg-[rgba(102,187,106,0.1)] text-success border border-success/20',
    warning: 'bg-[rgba(255,167,38,0.1)] text-warning border border-warning/20',
    error: 'bg-[rgba(239,83,80,0.1)] text-error border border-error/20',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
