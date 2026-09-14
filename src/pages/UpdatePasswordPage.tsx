import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg('Password updated! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 1500)
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-900">Set a new password</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          {successMsg && <p className="text-sm text-green-700">{successMsg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-800 disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}