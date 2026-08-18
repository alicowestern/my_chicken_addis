import React from 'react'
import { Loader2 } from 'lucide-react'

export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <Loader2 className={`animate-spin text-brand-cyan ${sizeMap[size]} ${className}`} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-brand-muted text-sm">Loading...</p>
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-brand-cyan mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-brand-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-brand-muted max-w-md">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function SectionHeader({
  title,
  label,
  description,
  centered = true,
  className = '',
  as = 'h2',
}: {
  title: string
  label?: string
  description?: string
  centered?: boolean
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  const HeadingTag = as

  return (
    <div className={`mb-12 flex flex-col ${centered ? 'items-center text-center mx-auto' : 'items-start text-left'} ${className}`}>
      {label && (
        <p className={`text-brand-cyan text-sm font-bold tracking-widest uppercase mb-4 ${centered ? 'text-center' : ''}`}>
          {label}
        </p>
      )}
      <HeadingTag className={`text-brand-white ${centered ? 'text-center' : ''} mb-6 ${as === 'h1' ? 'mb-8' : ''}`}>
        {title}
      </HeadingTag>
      {description && (
        <p className={`subheading max-w-2xl ${centered ? 'text-center' : ''}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
}: {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning'
  icon?: React.ReactNode
}) {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-brand-muted',
    warning: 'text-warning',
  }

  return (
    <div className="bg-brand-surface rounded-xl border border-[rgba(255,255,255,0.08)] p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-brand-muted">{label}</p>
        {icon && (
          <div className="text-brand-cyan">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold text-brand-white">{value}</p>
      {change && (
        <div className="mt-2 flex items-center gap-2">
          <span className={`text-xs font-medium ${changeColor[changeType]}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  )
}

export function Alert({
  variant = 'info',
  title,
  children,
  className = '',
}: {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  className?: string
}) {
  const styles = {
    info: 'bg-[rgba(79,195,247,0.1)] border-brand-cyan text-brand-cyan',
    success: 'bg-[rgba(102,187,106,0.1)] border-success text-success',
    warning: 'bg-[rgba(255,167,38,0.1)] border-warning text-warning',
    error: 'bg-[rgba(239,83,80,0.1)] border-error text-error',
  }

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${styles[variant]} ${className}`}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  )
}
