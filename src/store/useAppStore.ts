import { create } from 'zustand'
import { mockOnboardingAnswers, mockResumeData, mockRoadmapTasks, mockSkills, mockUserProfile } from '../mock-data/initialData'
import { supabase } from '../supabaseClient'
import type { CareerPath, OnboardingAnswers, ResumeData, RoadmapTask, Skill, UserProfile } from '../types'

type AppState = {
  userProfile: UserProfile
  onboardingAnswers: OnboardingAnswers
  skills: Skill[]
  selectedCareerPath: CareerPath | null
  roadmapTasks: RoadmapTask[]
  resumeData: ResumeData
  setUserProfile: (profile: Partial<UserProfile>) => void
  setOnboardingAnswers: (answers: Partial<OnboardingAnswers>) => void
  setSkills: (skills: Skill[]) => void
  setSelectedCareerPath: (careerPath: CareerPath | null) => void
  setRoadmapTasks: (tasks: RoadmapTask[]) => void
  toggleRoadmapTask: (taskId: string) => void
  setResumeData: (resume: ResumeData) => void
  resetStore: () => void
  hydrateFromSupabase: (userId: string) => Promise<void>
}

async function saveAppData(state: { skills: Skill[]; selectedCareerPath: CareerPath | null; roadmapTasks: RoadmapTask[]; resumeData: ResumeData }) {
  console.log('saveAppData called')
  const { data: { session } } = await supabase.auth.getSession()
  console.log('saveAppData session:', session)
  if (!session) {
    console.log('saveAppData: NO SESSION, aborting save')
    return
  }
  const { data, error } = await supabase.from('app_data').upsert({
    id: session.user.id,
    skills: state.skills,
    selected_career_path: state.selectedCareerPath,
    roadmap_tasks: state.roadmapTasks,
    resume_data: state.resumeData,
    updated_at: new Date().toISOString(),
  }).select()
  console.log('saveAppData result:', data, error)
}

const freshRoadmap = () => mockRoadmapTasks.map((task) => ({ ...task, completed: false }))

export const useAppStore = create<AppState>((set, get) => ({
  userProfile: mockUserProfile,
  onboardingAnswers: mockOnboardingAnswers,
  skills: mockSkills,
  selectedCareerPath: null,
  roadmapTasks: mockRoadmapTasks,
  resumeData: mockResumeData,

  setUserProfile: (profile) => set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),
  setOnboardingAnswers: (answers) => set((state) => ({ onboardingAnswers: { ...state.onboardingAnswers, ...answers } })),

  setSkills: (skills) => { set({ skills }); saveAppData({ ...get(), skills }) },
  setSelectedCareerPath: (selectedCareerPath) => { set({ selectedCareerPath }); saveAppData({ ...get(), selectedCareerPath }) },
  setRoadmapTasks: (roadmapTasks) => { set({ roadmapTasks }); saveAppData({ ...get(), roadmapTasks }) },
  toggleRoadmapTask: (taskId) => {
    const roadmapTasks = get().roadmapTasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task)
    set({ roadmapTasks })
    saveAppData({ ...get(), roadmapTasks })
  },
  setResumeData: (resumeData) => { set({ resumeData }); saveAppData({ ...get(), resumeData }) },

  resetStore: () => set({
    userProfile: mockUserProfile,
    onboardingAnswers: mockOnboardingAnswers,
    skills: mockSkills,
    selectedCareerPath: null,
    roadmapTasks: mockRoadmapTasks,
    resumeData: mockResumeData,
  }),

  hydrateFromSupabase: async (userId: string) => {
    const { data } = await supabase.from('app_data').select('*').eq('id', userId).maybeSingle()

    if (data) {
      set({
        skills: data.skills ?? [],
        selectedCareerPath: data.selected_career_path ?? null,
        roadmapTasks: data.roadmap_tasks?.length ? data.roadmap_tasks : freshRoadmap(),
        resumeData: data.resume_data ?? mockResumeData,
      })
    } else {
      const roadmapTasks = freshRoadmap()
      set({ skills: [], selectedCareerPath: null, roadmapTasks, resumeData: mockResumeData })
      await saveAppData({ skills: [], selectedCareerPath: null, roadmapTasks, resumeData: mockResumeData })
    }
  },
}))