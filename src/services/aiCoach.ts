import type { CareerPath, OnboardingAnswers, RoadmapTask, UserProfile } from '../types'

export type CoachContext = { userProfile: UserProfile; onboardingAnswers: OnboardingAnswers; careerPath: CareerPath; roadmapTasks: RoadmapTask[] }
export function getCoachResponse(prompt: string, context: CoachContext) {
  const nextTask = context.roadmapTasks.find((task) => !task.completed)
  const skills = [...context.onboardingAnswers.technicalSkills, ...context.onboardingAnswers.professionalSkills]
  const goal = context.onboardingAnswers.goals[0] ?? 'your next career step'
  const input = prompt.toLowerCase()
  if (input.includes('career recommended')) return `${context.careerPath.title} is shown as a direction to explore because it connects with the preferences and skills you shared. It is not a prediction—use the detail page to assess whether the role feels practical and interesting to you.`
  if (input.includes('skill gap')) return `For ${context.careerPath.title}, start with one useful skill at a time. You currently noted ${skills.length ? skills.join(', ') : 'some emerging strengths'}; the next focused area is ${context.careerPath.developSkills?.[0] ?? 'role-specific knowledge'}.`
  if (input.includes('career break')) return 'Keep your story factual and specific: name what you chose to do, what responsibilities you held, and the skills you used. You do not need to claim that a career break was formal employment for it to be worth explaining clearly.'
  if (input.includes('resume')) return 'Choose one truthful experience or activity and lead with what you did, how you approached it, and the result only if you can support it. The Resume Builder can help you reframe your own words without inventing details.'
  return `Your current goal is ${goal}. A manageable next step is ${nextTask ? `“${nextTask.title}” (about ${nextTask.estimatedTime})` : 'to review your completed roadmap and choose a new target'}. What would make that step feel easier this week?`
}
