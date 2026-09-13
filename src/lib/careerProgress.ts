import type { RoadmapTask } from '../types'

export const roadmapProgress = (tasks: RoadmapTask[]) =>
  tasks.length ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0

const stageWeeks: Record<string, number> = {
  'Understand Your Target Role': 1,
  'Build Your First Skill': 3,
  'Strengthen Your Professional Profile': 5,
  'Prepare for Opportunities': 7,
}

export const roadmapWeek = (tasks: RoadmapTask[]) => {
  for (const stage of Object.keys(stageWeeks)) {
    if (tasks.some((task) => task.stage === stage && !task.completed)) {
      return stageWeeks[stage]
    }
  }
  return 8
}