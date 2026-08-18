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
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-md border bg-brand-dark
            px-4 py-3 text-base text-brand-white
            placeholder:text-brand-gray
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-brand-cyan-dim focus:border-brand-cyan
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-11' : ''}
            ${
              error
                ? 'border-error focus:ring-[rgba(239,83,80,0.15)] focus:border-error'
                : 'border-brand-gray hover:border-brand-light-gray'
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
