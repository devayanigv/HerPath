import { Link } from 'react-router-dom'
import { Button, Card, ProgressBar } from '../components/ui'
import { roadmapProgress, roadmapWeek } from '../lib/careerProgress'
import { useAppStore } from '../store/useAppStore'

export function DashboardPage() {
  const { userProfile, selectedCareerPath, roadmapTasks, onboardingAnswers } = useAppStore()
  const progress = roadmapProgress(roadmapTasks)
  const path = selectedCareerPath
  const nextTask = roadmapTasks.find((task) => !task.completed)
  const targetSkills = path?.developSkills ?? []
  const currentSkills = new Set([...onboardingAnswers.technicalSkills, ...onboardingAnswers.professionalSkills].map((skill) => skill.toLowerCase()))
  const matchedSkills = targetSkills.filter((skill) => currentSkills.has(skill.toLowerCase())).length
  const completed = roadmapTasks.filter((task) => task.completed).slice(-3).reverse()

  return <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6"><section><p className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary-600">Your dashboard</p><h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-primary-800">Welcome back{userProfile.name ? `, ${userProfile.name}` : ''}.</h1><p className="mt-3 text-lg text-neutral-700">Let&apos;s keep moving your career forward.</p></section>

  {!path && <Card className="mt-8 border-secondary-200 bg-secondary-50 p-6"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-secondary-600">Get started</p><h2 className="mt-2 font-display text-2xl font-semibold text-primary-800">Choose your career path</h2><p className="mt-2 text-neutral-700">Complete career discovery to unlock personalized recommendations and progress tracking.</p><Link className="mt-4 inline-block" to="/career-discovery"><Button>Explore career paths</Button></Link></Card>}

  <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Career progress" value={`${progress}%`} detail="roadmap complete" /><Metric label="Current career path" value={path?.title ?? 'Not selected yet'} detail={path ? 'selected direction' : 'complete career discovery'} /><Metric label="Target skills" value={path ? `${matchedSkills}/${targetSkills.length}` : '—'} detail="skills already matched" /><Metric label="Roadmap position" value={`Week ${roadmapWeek(roadmapTasks)} of 8`} detail="your current focus" /></div><div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><Card className="border-primary-100 bg-primary-50 p-6"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-secondary-600">Next action</p><h2 className="mt-2 font-display text-3xl font-semibold text-primary-800">{nextTask?.title ?? 'Celebrate your progress'}</h2><p className="mt-3 max-w-xl text-neutral-700">{nextTask ? `Set aside about ${nextTask.estimatedTime} to complete this achievable next step.` : 'You’ve completed this roadmap. Your next opportunity is ready to explore.'}</p><Link className="mt-6 inline-block" to="/roadmap"><Button>Continue</Button></Link></Card><Card className="p-6"><h2 className="font-display text-2xl font-semibold text-primary-800">Recent activity</h2><ul className="mt-4 space-y-4">{completed.length ? completed.map((task) => <li key={task.id} className="flex gap-3 text-sm text-neutral-700"><span className="font-semibold text-success-700">✓</span>Completed {task.title}</li>) : <li className="text-sm text-neutral-700">Your completed steps will appear here.</li>}</ul></Card></div><Card className="mt-6 p-6"><div className="flex flex-wrap items-baseline justify-between gap-3"><h2 className="font-display text-2xl font-semibold text-primary-800">Roadmap progress</h2><Link className="text-sm font-semibold text-primary-700" to="/roadmap">View roadmap →</Link></div><div className="mt-4"><ProgressBar value={progress} label={`${roadmapTasks.filter((task) => task.completed).length} of ${roadmapTasks.length} actions completed`} /></div></Card></div>
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <Card className="p-5 shadow-none"><p className="text-sm text-neutral-700">{label}</p><p className="mt-2 font-display text-2xl font-semibold leading-tight text-primary-800">{value}</p><p className="mt-2 text-xs text-neutral-500">{detail}</p></Card> }