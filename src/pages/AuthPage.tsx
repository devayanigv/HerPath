import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

async function getPostLoginDestination(userId: string) {
  const { data } = await supabase
    .from('onboarding_responses')
    .select('answers')
    .eq('id', userId)
    .maybeSingle()

  const hasCompletedOnboarding = !!(data?.answers as { careerSituation?: string } | undefined)?.careerSituation
  return hasCompletedOnboarding ? '/dashboard' : '/onboarding'
}

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectMessage = (location.state as { message?: string })?.message

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setErrorMsg(error.message)
      } else if (data.session) {
        // Email confirmation is off, user is logged in immediately
        navigate('/onboarding')
      } else {
        setSuccessMsg('Success! Check your email to confirm your account.')
      }
    } else if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('Password reset link sent! Check your email.')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setErrorMsg(error.message)
      } else if (data.session) {
        const destination = await getPostLoginDestination(data.session.user.id)
        navigate(destination)
      }
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
          {mode === 'signup' ? 'Create an account' : mode === 'reset' ? 'Reset your password' : 'Welcome back'}
        </h2>

        {redirectMessage && (
          <p className="mt-2 text-sm text-primary-700">{redirectMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          )}

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => { setMode('reset'); setErrorMsg(''); setSuccessMsg('') }}
              className="text-sm font-medium text-primary-700 hover:underline"
            >
              Forgot your password?
            </button>
          )}

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          {successMsg && <p className="text-sm text-green-700">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-800 disabled:opacity-60"
          >
            {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : mode === 'reset' ? 'Send Reset Link' : 'Log In'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-600">
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg('') }} className="font-medium text-primary-700 underline-offset-2 hover:underline">Log in</button>
            </>
          ) : mode === 'reset' ? (
            <>Remembered your password?{' '}
              <button onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg('') }} className="font-medium text-primary-700 underline-offset-2 hover:underline">Log in</button>
            </>
          ) : (
            <>Don&apos;t have an account?{' '}
              <button onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg('') }} className="font-medium text-primary-700 underline-offset-2 hover:underline">Sign up</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}