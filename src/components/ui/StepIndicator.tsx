type StepIndicatorProps = { steps: string[]; currentStep: number }

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return <ol className="flex items-start" aria-label="Progress">{steps.map((step, index) => { const active = index <= currentStep; return <li key={step} className="flex flex-1 items-center last:flex-none"><div className="flex flex-col items-center gap-2"><span className={`grid size-8 place-items-center rounded-full text-sm font-semibold ${active ? 'bg-primary-700 text-white' : 'bg-neutral-200 text-neutral-700'}`}>{index + 1}</span><span className="hidden whitespace-nowrap text-xs text-neutral-700 sm:block">{step}</span></div>{index < steps.length - 1 && <span className={`mx-2 mb-5 h-px flex-1 ${index < currentStep ? 'bg-primary-700' : 'bg-neutral-200'}`} />}</li> })}</ol>
}
