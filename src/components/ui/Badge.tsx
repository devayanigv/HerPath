import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: 'neutral' | 'success' | 'warning' }
const tones = { neutral: 'bg-neutral-100 text-neutral-700', success: 'bg-success-50 text-success-700', warning: 'bg-warning-50 text-warning-700' }

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) { return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone], className)} {...props} /> }
