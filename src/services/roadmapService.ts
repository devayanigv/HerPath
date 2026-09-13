import type { RoadmapTask } from '../types'
import { requireSupabase } from '../lib/supabase'

export async function saveRoadmapTasks(userId: string, tasks: RoadmapTask[]) { const rows = tasks.map((task) => ({ id: task.id, user_id: userId, week_range: task.weeks, stage_title: task.stage, task_title: task.title, is_complete: task.completed, estimated_time: task.estimatedTime })); const { error } = await requireSupabase().from('roadmap_tasks').upsert(rows); if (error) throw error }
export async function loadRoadmapTasks(userId: string): Promise<RoadmapTask[]> { const { data, error } = await requireSupabase().from('roadmap_tasks').select('*').eq('user_id', userId); if (error) throw error; return (data ?? []).map((row) => ({ id: row.id, title: row.task_title, completed: row.is_complete, stage: row.stage_title, weeks: row.week_range, estimatedTime: row.estimated_time })) }
