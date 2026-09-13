import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }

const variants = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 disabled:bg-primary-700/50',
  secondary: 'border border-primary-700 bg-white text-primary-700 hover:bg-primary-50 disabled:border-neutral-300 disabled:text-neutral-500',
  ghost: 'text-primary-700 hover:bg-primary-50 disabled:text-neutral-500',
}

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn('inline-flex min-h-11 items-center justify-center rounded-control px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed', variants[variant], className)} {...props} />
}
