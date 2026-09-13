import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

export function Input({ className, id, label, error, ...props }: InputProps) {
  const inputId = id ?? props.name
  return <label className="block space-y-1.5">{label && <span className="text-sm font-medium text-neutral-700">{label}</span>}<input id={inputId} className={cn('min-h-11 w-full rounded-control border border-neutral-300 bg-white px-3 text-neutral-900 placeholder:text-neutral-500 hover:border-neutral-500', error && 'border-secondary-500', className)} aria-invalid={Boolean(error)} {...props} />{error && <span className="text-sm text-secondary-600">{error}</span>}</label>
}
