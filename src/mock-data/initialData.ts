import type { OnboardingAnswers, ResumeData, RoadmapTask, Skill, UserProfile } from '../types'

export const mockUserProfile: UserProfile = { id: 'local-user', name: '', headline: '' }
export const mockOnboardingAnswers: OnboardingAnswers = {
  interests: [], workPreferences: [], confidenceAreas: [], experiences: [], noFormalExperience: false,
  technicalSkills: [], professionalSkills: [], unsureAboutSkills: false, goals: [], priorities: [], careerBreakActivities: [], careerBreakNotes: '',
}
export const mockSkills: Skill[] = []
export const mockRoadmapTasks: RoadmapTask[] = [
  { id: 'review-roles', title: 'Review 5 job descriptions', completed: true, stage: 'Understand Your Target Role', weeks: 'Week 1–2', estimatedTime: '30 min', targetSkill: 'Industry knowledge', aiAssistance: true },
  { id: 'common-skills', title: 'Identify common skills', completed: true, stage: 'Understand Your Target Role', weeks: 'Week 1–2', estimatedTime: '25 min', targetSkill: 'Industry knowledge', aiAssistance: true },
  { id: 'role-expectations', title: 'Understand role expectations', completed: false, stage: 'Understand Your Target Role', weeks: 'Week 1–2', estimatedTime: '20 min', targetSkill: 'Industry knowledge' },
  { id: 'learning-activity', title: 'Complete a learning activity', completed: true, stage: 'Build Your First Skill', weeks: 'Week 3–4', estimatedTime: '90 min', targetSkill: 'Data analysis', aiAssistance: true },
  { id: 'small-project', title: 'Practice with a small project', completed: false, stage: 'Build Your First Skill', weeks: 'Week 3–4', estimatedTime: '2 hrs', targetSkill: 'Data analysis', aiAssistance: true },
  { id: 'save-evidence', title: 'Save evidence of your work', completed: false, stage: 'Build Your First Skill', weeks: 'Week 3–4', estimatedTime: '20 min', targetSkill: 'Product tools' },
  { id: 'update-resume', title: 'Update your resume', completed: true, stage: 'Strengthen Your Professional Profile', weeks: 'Week 5–6', estimatedTime: '45 min', targetSkill: 'Communication', aiAssistance: true },
  { id: 'professional-profile', title: 'Improve your professional profile', completed: false, stage: 'Strengthen Your Professional Profile', weeks: 'Week 5–6', estimatedTime: '45 min', targetSkill: 'Communication', aiAssistance: true },
  { id: 'transferable-experience', title: 'Document transferable experience', completed: false, stage: 'Strengthen Your Professional Profile', weeks: 'Week 5–6', estimatedTime: '30 min', targetSkill: 'Project coordination' },
  { id: 'interview-practice', title: 'Practice interviews', completed: false, stage: 'Prepare for Opportunities', weeks: 'Week 7–8', estimatedTime: '60 min', targetSkill: 'Communication', aiAssistance: true },
  { id: 'positions', title: 'Identify suitable positions', completed: false, stage: 'Prepare for Opportunities', weeks: 'Week 7–8', estimatedTime: '30 min', targetSkill: 'Industry knowledge' },
  { id: 'applications', title: 'Begin applications', completed: false, stage: 'Prepare for Opportunities', weeks: 'Week 7–8', estimatedTime: '45 min', targetSkill: 'Organization', aiAssistance: true },
]
export const mockResumeData: ResumeData = { summary: '', experience: [], education: [], projects: [], achievements: [] }
