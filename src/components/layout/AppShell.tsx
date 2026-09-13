import { Link, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { useAuth } from '../../context/AuthContext'

export function AppShell() {
  const { session } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
          <Link className="font-display text-2xl font-semibold tracking-tight text-primary-700" to="/">
            HerPath
          </Link>
          <div className="flex items-center gap-6">
            <Link className="text-sm font-medium text-neutral-700 hover:text-primary-700" to="/demo">
              How It Works
            </Link>
            {session ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-neutral-700 hover:text-primary-700"
              >
                Log Out
              </button>
            ) : (
              <Link className="text-sm font-medium text-neutral-700 hover:text-primary-700" to="/login">
                Log In
              </Link>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}