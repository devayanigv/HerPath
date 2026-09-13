export type UserProfile = { id: string; name: string; headline: string; location?: string; yearsOfExperience?: number }
export type ExperienceEntry = { id: string; jobTitle: string; organization: string; industry: string; duration: string; responsibilities: string; achievements: string }
export type OnboardingAnswers = {
  careerSituation?: string
  careerBreakDuration?: string
  experiences: ExperienceEntry[]
  noFormalExperience: boolean
  technicalSkills: string[]
  professionalSkills: string[]
  unsureAboutSkills: boolean
  goals: string[]
  priorities: string[]
  workArrangement?: string
  employmentType?: string
  weeklyTime?: string
  returnTimeline?: string
  interests: string[]
  workPreferences: string[]
  confidenceAreas: string[]
  careerBreakActivities: string[]
  careerBreakNotes: string
}
export type Skill = { id: string; name: string; level: 'beginner' | 'intermediate' | 'advanced'; verified: boolean }
export type CareerPath = {
  id: string
  title: string
  description: string
  matchScore?: number
  fitReasons?: string[]
  developSkills?: string[]
  roleOverview?: string
  entryPoints?: string[]
}
export type RoadmapTask = { id: string; title: string; completed: boolean; stage: string; weeks: string; estimatedTime: string; targetSkill?: string; aiAssistance?: boolean; dueDate?: string }
export type ResumeData = { summary: string; experience: Array<{ id: string; role: string; company: string; highlights: string[] }>; education: Array<{ id: string; school: string; credential: string }>; projects: string[]; achievements: string[] }
