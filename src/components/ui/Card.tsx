import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={`
        bg-brand-surface rounded-xl border border-brand-gray-200
        shadow-sm
        ${
          hover
            ? 'transition-all duration-300 ease-in-out hover:border-brand-cyan-dark hover:shadow-md hover:-translate-y-1'
            : ''
        }
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// Sub-components for structured cards
export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`pb-4 border-b border-brand-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`py-4 ${className}`}>{children}</div>
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`pt-4 border-t border-brand-gray-200 ${className}`}>
      {children}
    </div>
  )
}
