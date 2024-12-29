import { defineStore } from 'pinia'
import { type Project } from '@/types/Project'
import { getProjects, createProject, updateProject, deleteProject } from '@/services/projectService'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
  }),

  actions: {
    loadFromLocalStorage() {
      const storedProjects = localStorage.getItem('projects')
      if (storedProjects) {
        try {
          this.projects = JSON.parse(storedProjects) as Project[]
        } catch (error) {
          console.error('Failed to parse projects from localStorage', error)
          this.projects = []
        }
      }
    },

    saveProjects() {
      localStorage.setItem('projects', JSON.stringify(this.projects))
    },

    async fetchProjects() {
      try {
        this.projects = await getProjects()
        this.saveProjects()
      } catch (error) {
        console.error('Failed to fetch projects', error)
      }
    },

    async addProject(newProject: Project) {
      try {
        const project = await createProject(newProject)
        this.projects.push(project)
        this.saveProjects()
      } catch (error) {
        console.error('Failed to add project', error)
      }
    },

    async updateProject(id: number, updatedFields: Partial<Project>) {
      try {
        await updateProject(id, updatedFields)
        this.projects = this.projects.map((project) =>
          project.id === id ? { ...project, ...updatedFields } : project,
        )
        this.saveProjects()
      } catch (error) {
        console.error('Failed to update project', error)
      }
    },

    async deleteProject(id: number) {
      try {
        await deleteProject(id)
        this.projects = this.projects.filter((project) => project.id !== id)
        this.saveProjects()
      } catch (error) {
        console.error('Failed to delete project', error)
      }
    },
  },
})
