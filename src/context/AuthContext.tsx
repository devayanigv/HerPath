import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import { useAppStore } from '../store/useAppStore'

interface AuthContextType {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true })

async function loadUserData(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  const { data: onboarding } = await supabase
    .from('onboarding_responses')
    .select('answers')
    .eq('id', userId)
    .maybeSingle()

  if (profile) {
    useAppStore.getState().setUserProfile({
      name: profile.full_name ?? '',
      yearsOfExperience: profile.years_of_experience ?? undefined,
      location: profile.location ?? '',
    })
  }

  if (onboarding?.answers) {
    useAppStore.getState().setOnboardingAnswers(onboarding.answers)
  }
  await useAppStore.getState().hydrateFromSupabase(userId)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return
      if (session) {
        await loadUserData(session.user.id)
      }
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        useAppStore.getState().resetStore()
        await loadUserData(session.user.id)
      }

      if (event === 'SIGNED_OUT') {
        useAppStore.getState().resetStore()
      }

      setSession(session)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}