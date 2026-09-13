import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: Array<{ label: string; value: string }> }

export function Select({ className, id, label, options, ...props }: SelectProps) {
  const selectId = id ?? props.name
  return <label className="block space-y-1.5">{label && <span className="text-sm font-medium text-neutral-700">{label}</span>}<select id={selectId} className={cn('min-h-11 w-full rounded-control border border-neutral-300 bg-white px-3 text-neutral-900 hover:border-neutral-500', className)} {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}
