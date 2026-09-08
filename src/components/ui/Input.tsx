import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  compact?: boolean
}

export default function Input({
  label,
  error,
  helperText,
  icon,
  compact = false,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-brand-light-gray mb-1.5"
        >
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray group-focus-within:text-brand-cyan transition-colors">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-lg border bg-brand-dark/40
            text-sm text-brand-white
            placeholder:text-brand-gray/60
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 focus:border-brand-cyan/50
            focus:bg-brand-dark/80
            disabled:opacity-50 disabled:cursor-not-allowed
            ${compact ? 'px-3 py-2' : 'px-4 py-3'}
            ${icon ? (compact ? 'pl-9' : 'pl-11') : ''}
            ${
              error
                ? 'border-error/50 focus:ring-error/20 focus:border-error'
                : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-brand-muted">{helperText}</p>
      )}
    </div>
  )
}
