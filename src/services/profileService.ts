import type { OnboardingAnswers, UserProfile } from '../types'
import { requireSupabase } from '../lib/supabase'

export async function ensureProfile(userId: string) { const { error } = await requireSupabase().from('profiles').upsert({ id: userId }, { onConflict: 'id' }); if (error) throw error }
export async function saveProfile(userId: string, profile: UserProfile, answers: OnboardingAnswers) { const { error } = await requireSupabase().from('profiles').upsert({ id: userId, name: profile.name, location: profile.location ?? null, years_experience: profile.yearsOfExperience ?? null, career_stage: answers.careerSituation ?? null, career_break_duration: answers.careerBreakDuration ?? null, work_arrangement: answers.workArrangement ?? null, employment_type: answers.employmentType ?? null, learning_hours_per_week: answers.weeklyTime ?? null }, { onConflict: 'id' }); if (error) throw error }
export async function loadProfile(userId: string) { const { data, error } = await requireSupabase().from('profiles').select('*').eq('id', userId).maybeSingle(); if (error) throw error; return data }
