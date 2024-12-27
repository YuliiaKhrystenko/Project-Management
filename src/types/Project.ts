import type { ProjectStatus } from './types'

export interface Project {
  id: number
  name: string
  description?: string
  tasksCount: number
  status: ProjectStatus
  createdAt: string
}
