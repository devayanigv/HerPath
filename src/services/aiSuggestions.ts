export type ResumeSuggestion = { id: string; original: string; suggestion: string; rationale: string; target?: string }

// Intentionally source-bound: this mock only rearranges supplied wording and never adds facts.
export function suggestResumeRephrase(source: string, mode: 'concise' | 'transferable'): ResumeSuggestion | null {
  const trimmed = source.trim()
  if (!trimmed) return null
  const suggestion = mode === 'concise'
    ? trimmed.replace(/\s+/g, ' ').replace(/\bvery\b\s*/gi, '').replace(/\breally\b\s*/gi, '')
    : `Applied transferable strengths in ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`
  return { id: crypto.randomUUID(), original: trimmed, suggestion, rationale: mode === 'concise' ? 'This keeps your wording while removing filler.' : 'This reframes only the activity you entered; it does not add achievements or qualifications.' }
}
