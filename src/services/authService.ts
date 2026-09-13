import type { Session } from '@supabase/supabase-js'
import { requireSupabase, supabase } from '../lib/supabase'

export const getSession = async (): Promise<Session | null> => (await requireSupabase().auth.getSession()).data.session
export const signIn = async (email: string, password: string) => { const { error } = await requireSupabase().auth.signInWithPassword({ email, password }); if (error) throw error }
export const signUp = async (email: string, password: string) => { const { error } = await requireSupabase().auth.signUp({ email, password }); if (error) throw error }
export const signOut = async () => { const { error } = await requireSupabase().auth.signOut(); if (error) throw error }
export const onAuthChange = (callback: (session: Session | null) => void) => supabase?.auth.onAuthStateChange((_event, session) => callback(session))
