import type { TaskStatus } from './types'

export interface Task {
  id: number
  name: string
  projectId: number
  assignee: string | number
  status: TaskStatus
  dueDate: string
}
