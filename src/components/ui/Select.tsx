import React from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
}

export default function Select({
  label,
  error,
  helperText,
  options,
  placeholder,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-brand-light-gray mb-1.5"
        >
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full appearance-none rounded-md border bg-brand-dark
            px-4 py-3 pr-10 text-base text-brand-white
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-brand-cyan-dim focus:border-brand-cyan
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? 'border-error focus:ring-[rgba(239,83,80,0.15)] focus:border-error'
                : 'border-brand-gray hover:border-brand-light-gray'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-brand-gray">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-brand-dark">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gray">
          <ChevronDown className="w-5 h-5" />
        </div>
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
