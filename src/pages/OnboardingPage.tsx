import { useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, ProgressBar, Select, StepIndicator } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import type { ExperienceEntry } from '../types'

const steps = ['About You', 'Experience', 'Skills', 'Goals', 'Preferences']
const situations = ['Returning after a career break', 'Looking for my first job', 'Looking to switch careers', 'Currently unemployed', 'Currently working but want a change', 'Returning after caregiving', "I’m not sure what I want yet"]
const technicalSkillOptions = ['Excel', 'Python', 'SQL', 'Data Analysis', 'Digital Marketing', 'Project Management']
const professionalSkillOptions = ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Organization', 'Presentation']
const goalOptions = ['Return to my previous career', 'Change careers', 'Get a better job', 'Increase my earning potential', 'Build new skills', 'Return to work after a long break', 'Find a career direction', 'Start a new professional journey']
const priorityOptions = ['Stability', 'Salary', 'Flexibility', 'Growth', 'Meaningful work', 'Work-life balance']
const blankExperience = (): ExperienceEntry => ({ id: crypto.randomUUID(), jobTitle: '', organization: '', industry: '', duration: '', responsibilities: '', achievements: '' })

export function OnboardingPage() {
  const navigate = useNavigate()
  const { userProfile, onboardingAnswers, setUserProfile, setOnboardingAnswers } = useAppStore()
  const { session } = useAuth()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customTechnical, setCustomTechnical] = useState('')
  const [customProfessional, setCustomProfessional] = useState('')
  const answers = onboardingAnswers

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (step === 0 && !answers.careerSituation) nextErrors.careerSituation = 'Choose the option that best describes where you are today.'
    if (step === 1 && !answers.noFormalExperience && (answers.experiences.length === 0 || answers.experiences.some((experience) => !experience.jobTitle.trim()))) nextErrors.experience = 'Add an experience with a job title, or select the option below.'
    if (step === 2 && !answers.unsureAboutSkills && answers.technicalSkills.length + answers.professionalSkills.length === 0) nextErrors.skills = 'Choose at least one skill, add your own, or let the assessment help.'
    if (step === 3 && answers.goals.length === 0) nextErrors.goals = 'Choose at least one goal to shape your path.'
    if (step === 4) {
      if (!answers.workArrangement) nextErrors.workArrangement = 'Choose a work arrangement.'
      if (!answers.employmentType) nextErrors.employmentType = 'Choose an employment type.'
      if (!answers.weeklyTime) nextErrors.weeklyTime = 'Choose a realistic time commitment.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const next = async () => {
    console.log('--- NEXT CLICKED ---')
    console.log('Session:', session)

    if (!validate()) {
      console.log('Validation FAILED, stopping here')
      return
    }

    console.log('Validation passed, attempting save...')

    if (session) {
      const { data: obData, error: onboardingError } = await supabase.from('onboarding_responses').upsert({
        id: session.user.id,
        answers: answers,
        updated_at: new Date().toISOString(),
      }).select()
      console.log('Onboarding save result:', obData, onboardingError)

      const { data: profData, error: profileError } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: userProfile.name,
        years_of_experience: userProfile.yearsOfExperience ?? null,
        location: userProfile.location ?? null,
      }).select()
      console.log('Profile save result:', profData, profileError)
    } else {
      console.log('No session found! Cannot save.')
    }

    if (step === steps.length - 1) {
      navigate('/career-analysis')
      return
    }
    setErrors({})
    setStep((current) => current + 1)
  }

  const back = () => { setErrors({}); setStep((current) => Math.max(0, current - 1)) }
  const toggle = (key: 'technicalSkills' | 'professionalSkills' | 'goals' | 'priorities', value: string) => setOnboardingAnswers({ [key]: answers[key].includes(value) ? answers[key].filter((item) => item !== value) : [...answers[key], value] })
  const addSkill = (key: 'technicalSkills' | 'professionalSkills', value: string, reset: (value: string) => void) => { const trimmed = value.trim(); if (trimmed && !answers[key].includes(trimmed)) setOnboardingAnswers({ [key]: [...answers[key], trimmed] }); reset('') }
  const updateExperience = (id: string, field: keyof Omit<ExperienceEntry, 'id'>, value: string) => setOnboardingAnswers({ experiences: answers.experiences.map((entry) => entry.id === id ? { ...entry, [field]: value } : entry) })

  return <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14"><div className="mb-10"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary-600">Your career journey</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-primary-800">Let&apos;s build a starting point.</h1><p className="mt-3 text-neutral-700">Your answers stay with you as you move through the process.</p></div><StepIndicator steps={steps} currentStep={step} /><div className="mt-8"><ProgressBar value={Math.round(((step + 1) / steps.length) * 100)} label={`Step ${step + 1} of ${steps.length}`} /></div><Card className="mt-8 p-5 sm:p-8"><form onSubmit={(event) => { event.preventDefault(); next() }}>{step === 0 && <AboutYou answers={answers} userProfile={userProfile} errors={errors} onAnswers={setOnboardingAnswers} onProfile={setUserProfile} />}{step === 1 && <Experience answers={answers} errors={errors} onAnswers={setOnboardingAnswers} onUpdate={updateExperience} />}{step === 2 && <Skills answers={answers} errors={errors} onAnswers={setOnboardingAnswers} toggle={toggle} customTechnical={customTechnical} setCustomTechnical={setCustomTechnical} customProfessional={customProfessional} setCustomProfessional={setCustomProfessional} addSkill={addSkill} />}{step === 3 && <Goals answers={answers} errors={errors} toggle={toggle} />}{step === 4 && <Preferences answers={answers} errors={errors} onAnswers={setOnboardingAnswers} />}<div className="mt-9 flex items-center justify-between border-t border-neutral-200 pt-6">{step > 0 ? <Button variant="ghost" onClick={back}>Back</Button> : <span />}{<Button type="submit">{step === steps.length - 1 ? 'See My Career Analysis' : 'Continue'}</Button>}</div></form></Card></div>
}

function AboutYou({ answers, userProfile, errors, onAnswers, onProfile }: Pick<OnboardingProps, 'answers' | 'errors' | 'onAnswers'> & { userProfile: ReturnType<typeof useAppStore.getState>['userProfile']; onProfile: ReturnType<typeof useAppStore.getState>['setUserProfile'] }) { return <section><Heading title="Where are you in your career right now?" description="There’s no wrong place to begin. Choose the option closest to your current situation." /><ChoiceGrid options={situations} value={answers.careerSituation} onChange={(value) => onAnswers({ careerSituation: value })} error={errors.careerSituation} /><div className="mt-8 grid gap-5 sm:grid-cols-2"><Input label="Name" value={userProfile.name} onChange={(event) => onProfile({ name: event.target.value })} placeholder="Your name" /><Input label="Years of professional experience" type="number" min="0" value={userProfile.yearsOfExperience ?? ''} onChange={(event) => onProfile({ yearsOfExperience: event.target.value === '' ? undefined : Number(event.target.value) })} placeholder="e.g. 6" /><Input label="Location" value={userProfile.location ?? ''} onChange={(event) => onProfile({ location: event.target.value })} placeholder="City, region, or country" /><Select label="Career-break duration (optional)" value={answers.careerBreakDuration ?? ''} onChange={(event) => onAnswers({ careerBreakDuration: event.target.value })} options={[{ label: 'Select if relevant', value: '' }, { label: 'Less than 1 year', value: 'less-than-one-year' }, { label: '1–2 years', value: 'one-to-two-years' }, { label: '3–5 years', value: 'three-to-five-years' }, { label: '5+ years', value: 'five-plus-years' }]} /></div></section> }

function Experience({ answers, errors, onAnswers, onUpdate }: Pick<OnboardingProps, 'answers' | 'errors' | 'onAnswers'> & { onUpdate: (id: string, field: keyof Omit<ExperienceEntry, 'id'>, value: string) => void }) { const entries = answers.experiences; return <section><Heading title="Tell us about your experience." description="Informal, volunteer, freelance, and caregiving experience can be just as valuable to include." /><label className="flex cursor-pointer items-start gap-3 rounded-control border border-neutral-200 bg-neutral-50 p-4"><input className="mt-1 size-4 accent-primary-700" type="checkbox" checked={answers.noFormalExperience} onChange={(event) => onAnswers({ noFormalExperience: event.target.checked, experiences: event.target.checked ? [] : entries })} /><span><span className="block font-medium text-neutral-900">I don&apos;t have formal work experience yet.</span><span className="mt-1 block text-sm text-neutral-700">We&apos;ll help you identify transferable skills in the next steps.</span></span></label>{!answers.noFormalExperience && <><div className="mt-6 space-y-5">{entries.map((entry, index) => <ExperienceForm key={entry.id} entry={entry} number={index + 1} onUpdate={onUpdate} onRemove={() => onAnswers({ experiences: entries.filter((item) => item.id !== entry.id) })} removable={entries.length > 1} />)}</div><Button variant="secondary" className="mt-5" onClick={() => onAnswers({ experiences: [...entries, blankExperience()] })}>+ Add another experience</Button>{errors.experience && <ErrorMessage message={errors.experience} />}</>}</section> }

function Skills({ answers, errors, onAnswers, toggle, customTechnical, setCustomTechnical, customProfessional, setCustomProfessional, addSkill }: Pick<OnboardingProps, 'answers' | 'errors' | 'onAnswers'> & { toggle: OnboardingProps['toggle']; customTechnical: string; setCustomTechnical: (value: string) => void; customProfessional: string; setCustomProfessional: (value: string) => void; addSkill: (key: 'technicalSkills' | 'professionalSkills', value: string, reset: (value: string) => void) => void }) { return <section><Heading title="What skills do you bring with you?" description="Choose the skills that feel familiar. You can always refine these later." /><SkillGroup title="Technical skills" options={technicalSkillOptions} values={answers.technicalSkills} onToggle={(value) => toggle('technicalSkills', value)} customValue={customTechnical} setCustomValue={setCustomTechnical} addCustom={() => addSkill('technicalSkills', customTechnical, setCustomTechnical)} /><SkillGroup title="Professional skills" options={professionalSkillOptions} values={answers.professionalSkills} onToggle={(value) => toggle('professionalSkills', value)} customValue={customProfessional} setCustomValue={setCustomProfessional} addCustom={() => addSkill('professionalSkills', customProfessional, setCustomProfessional)} /><label className="mt-6 flex cursor-pointer items-start gap-3 rounded-control border border-neutral-200 bg-neutral-50 p-4"><input className="mt-1 size-4 accent-primary-700" type="checkbox" checked={answers.unsureAboutSkills} onChange={(event) => onAnswers({ unsureAboutSkills: event.target.checked })} /><span><span className="block font-medium text-neutral-900">I&apos;m not sure what my strongest skills are.</span><span className="mt-1 block text-sm text-neutral-700">That&apos;s okay. The assessment can help surface transferable skills from your experience.</span></span></label>{errors.skills && <ErrorMessage message={errors.skills} />}</section> }

function Goals({ answers, errors, toggle }: Pick<OnboardingProps, 'answers' | 'errors' | 'toggle'>) { return <section><Heading title="What would you like to achieve?" description="Choose every goal that feels relevant right now." /><ChoiceGrid multiple options={goalOptions} values={answers.goals} onToggle={(value) => toggle('goals', value)} error={errors.goals} /><h3 className="mt-8 text-lg font-semibold text-primary-800">What matters most to you right now?</h3><p className="mt-1 text-sm text-neutral-700">Choose as many as apply.</p><ChoiceGrid multiple options={priorityOptions} values={answers.priorities} onToggle={(value) => toggle('priorities', value)} /></section> }

function Preferences({ answers, errors, onAnswers }: Pick<OnboardingProps, 'answers' | 'errors' | 'onAnswers'>) { return <section><Heading title="What kind of work will fit your life?" description="We’ll use these preferences to make your recommendations practical." /><PreferenceGroup title="Work arrangement" options={['Remote', 'Hybrid', 'On-site', 'Flexible']} value={answers.workArrangement} onChange={(value) => onAnswers({ workArrangement: value })} error={errors.workArrangement} /><PreferenceGroup title="Employment type" options={['Full-time', 'Part-time', 'Contract', 'Open to options']} value={answers.employmentType} onChange={(value) => onAnswers({ employmentType: value })} error={errors.employmentType} /><PreferenceGroup title="How much time can you realistically dedicate to your career development each week?" options={['1–2 hrs', '3–5 hrs', '5–10 hrs', '10+ hrs']} value={answers.weeklyTime} onChange={(value) => onAnswers({ weeklyTime: value })} error={errors.weeklyTime} /></section> }

type OnboardingProps = { answers: ReturnType<typeof useAppStore.getState>['onboardingAnswers']; errors: Record<string, string>; onAnswers: ReturnType<typeof useAppStore.getState>['setOnboardingAnswers']; toggle: (key: 'technicalSkills' | 'professionalSkills' | 'goals' | 'priorities', value: string) => void }
function Heading({ title, description }: { title: string; description: string }) { return <div className="mb-6"><h2 className="font-display text-3xl font-semibold tracking-tight text-primary-800">{title}</h2><p className="mt-2 text-neutral-700">{description}</p></div> }
function ErrorMessage({ message }: { message: string }) { return <p className="mt-3 text-sm font-medium text-secondary-600" role="alert">{message}</p> }
function ChoiceGrid({ options, value, values, onChange, onToggle, multiple = false, error }: { options: string[]; value?: string; values?: string[]; onChange?: (value: string) => void; onToggle?: (value: string) => void; multiple?: boolean; error?: string }) { return <><div className="grid gap-3 sm:grid-cols-2">{options.map((option) => { const selected = multiple ? values?.includes(option) : value === option; return <button type="button" key={option} aria-pressed={selected} onClick={() => multiple ? onToggle?.(option) : onChange?.(option)} className={`rounded-control border p-4 text-left text-sm font-medium transition-colors ${selected ? 'border-primary-700 bg-primary-50 text-primary-800' : 'border-neutral-300 text-neutral-700 hover:border-primary-500 hover:bg-primary-50/50'}`}>{option}</button> })}</div>{error && <ErrorMessage message={error} />}</> }
function ExperienceForm({ entry, number, onUpdate, onRemove, removable }: { entry: ExperienceEntry; number: number; onUpdate: (id: string, field: keyof Omit<ExperienceEntry, 'id'>, value: string) => void; onRemove: () => void; removable: boolean }) { const update = (field: keyof Omit<ExperienceEntry, 'id'>) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onUpdate(entry.id, field, event.target.value); return <div className="rounded-card border border-neutral-200 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold text-primary-800">Experience {number}</h3>{removable && <button type="button" onClick={onRemove} className="text-sm font-medium text-secondary-600 hover:text-secondary-700">Remove</button>}</div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Input label="Job title" value={entry.jobTitle} onChange={update('jobTitle')} /><Input label="Company / organization" value={entry.organization} onChange={update('organization')} /><Input label="Industry" value={entry.industry} onChange={update('industry')} /><Input label="Duration" value={entry.duration} onChange={update('duration')} placeholder="e.g. 2021–2024" /></div><div className="mt-4 grid gap-4"><TextArea label="Responsibilities" value={entry.responsibilities} onChange={update('responsibilities')} /><TextArea label="Achievements" value={entry.achievements} onChange={update('achievements')} /></div></div> }
function TextArea({ label, ...props }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) { return <label className="block space-y-1.5"><span className="text-sm font-medium text-neutral-700">{label}</span><textarea className="min-h-24 w-full rounded-control border border-neutral-300 bg-white px-3 py-2 text-neutral-900 hover:border-neutral-500" {...props} /></label> }
function SkillGroup({ title, options, values, onToggle, customValue, setCustomValue, addCustom }: { title: string; options: string[]; values: string[]; onToggle: (value: string) => void; customValue: string; setCustomValue: (value: string) => void; addCustom: () => void }) { const all = [...new Set([...options, ...values])]; return <div className="mt-7"><h3 className="text-lg font-semibold text-primary-800">{title}</h3><div className="mt-3 flex flex-wrap gap-2">{all.map((skill) => <button key={skill} type="button" aria-pressed={values.includes(skill)} onClick={() => onToggle(skill)} className={`rounded-full border px-3 py-1.5 text-sm font-medium ${values.includes(skill) ? 'border-primary-700 bg-primary-50 text-primary-800' : 'border-neutral-300 text-neutral-700 hover:border-primary-500'}`}>{skill}</button>)}</div><div className="mt-3 flex gap-2"><Input aria-label={`Add a ${title.toLowerCase().slice(0, -1)}`} value={customValue} onChange={(event) => setCustomValue(event.target.value)} placeholder="Add a skill" /><Button variant="secondary" onClick={addCustom}>Add</Button></div></div> }
function PreferenceGroup({ title, options, value, onChange, error }: { title: string; options: string[]; value?: string; onChange: (value: string) => void; error?: string }) { return <div className="mt-7"><h3 className="text-lg font-semibold text-primary-800">{title}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{options.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-control border p-3.5 ${value === option ? 'border-primary-700 bg-primary-50' : 'border-neutral-300 hover:border-primary-500'}`}><input type="radio" className="size-4 accent-primary-700" name={title} checked={value === option} onChange={() => onChange(option)} /><span className="text-sm font-medium text-neutral-700">{option}</span></label>)}</div>{error && <ErrorMessage message={error} />}</div> }