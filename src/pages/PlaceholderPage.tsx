type PlaceholderPageProps = { title: string }

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return <section className="flex min-h-[55vh] items-center justify-center"><div className="max-w-md text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-secondary-600">HerPath · Phase 1</p><h1 className="font-display text-4xl font-semibold tracking-tight text-primary-800">{title}</h1><p className="mt-4 text-neutral-700">This route is ready for its screen. The design system and local state foundation are in place.</p></div></section>
}
