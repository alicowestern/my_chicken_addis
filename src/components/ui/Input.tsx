import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export default function Input({
  label,
  error,
  helperText,
  icon,
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
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray group-focus-within:text-brand-cyan transition-colors">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border bg-brand-dark/40 backdrop-blur-md
            px-5 py-4 text-base text-brand-white shadow-inner
            placeholder:text-brand-gray/60
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan
            focus:bg-brand-dark/80
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-12' : ''}
            ${
              error
                ? 'border-error/50 focus:ring-error/20 focus:border-error'
                : 'border-white/10 hover:border-white/20'
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
