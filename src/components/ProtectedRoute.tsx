import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  if (!session) return <Navigate to="/login" state={{ message: 'Log in to continue your career journey' }} replace />

  return <>{children}</>
}