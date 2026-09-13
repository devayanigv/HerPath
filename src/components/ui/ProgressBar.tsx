type ProgressBarProps = { value: number; label?: string }

export function ProgressBar({ value, label }: ProgressBarProps) {
  const progress = Math.max(0, Math.min(100, value))
  return <div className="space-y-2"><div className="flex justify-between text-sm text-neutral-700">{label && <span>{label}</span>}<span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-primary-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-primary-600 transition-[width]" style={{ width: `${progress}%` }} /></div></div>
}
