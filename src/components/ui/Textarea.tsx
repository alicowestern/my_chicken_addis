import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function Textarea({
  label,
  error,
  helperText,
  id,
  className = '',
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-brand-light-gray mb-1.5"
        >
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`
          w-full rounded-md border bg-brand-dark
          px-4 py-3 text-base text-brand-white
          placeholder:text-brand-gray
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-brand-cyan-dim focus:border-brand-cyan
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-vertical
          ${
            error
              ? 'border-error focus:ring-[rgba(239,83,80,0.15)] focus:border-error'
              : 'border-brand-gray hover:border-brand-light-gray'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-brand-muted">{helperText}</p>
      )}
    </div>
  )
}
