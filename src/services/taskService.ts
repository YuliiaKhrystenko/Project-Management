import api from './api'
import { type Task } from '@/types/Task'

export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  const response = await api.get(`/tasks?projectId=${projectId}`)
  return response.data
}

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await api.post('/tasks', task)
  return response.data
}

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, task)
  return response.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}
