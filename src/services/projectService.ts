import api from './api'
import { type Project } from '@/types/Project'

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects')
  return response.data
}

export const createProject = async (project: Project): Promise<Project> => {
  const response = await api.post('/projects', project)
  return response.data
}

export const updateProject = async (id: number, project: Partial<Project>): Promise<Project> => {
  const response = await api.patch(`/projects/${id}`, project)
  return response.data
}

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`)
}
