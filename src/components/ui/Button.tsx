import React from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light' | 'outline-light'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-cyan text-brand-dark-deep font-bold hover:bg-brand-cyan/90 shadow-[0_0_16px_rgba(79,195,247,0.2)] hover:shadow-[0_0_24px_rgba(79,195,247,0.35)] transition-shadow',
  secondary:
    'bg-brand-surface text-brand-white border border-[rgba(255,255,255,0.1)] hover:bg-brand-surface-hover hover:border-[rgba(255,255,255,0.2)]',
  ghost:
    'bg-transparent text-brand-light-gray border-transparent hover:text-brand-cyan hover:bg-brand-cyan/5',
  danger:
    'bg-error text-white hover:brightness-110 shadow-sm',
  light:
    'bg-white text-brand-cyan-dark hover:bg-brand-gray-50 shadow-sm',
  'outline-light':
    'bg-transparent text-white border border-white/20 hover:bg-white/10',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-200 ease-in-out
        hover:-translate-y-px active:translate-y-0
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
