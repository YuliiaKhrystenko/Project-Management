import { defineStore } from 'pinia'
import { type Project } from '@/types/Project'
import { getProjects, createProject, updateProject, deleteProject } from '@/services/projectService'
import { POSITION, useToast } from 'vue-toastification'

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
      const toast = useToast()
      try {
        const project = await createProject(newProject)
        this.projects.push(project)
        this.saveProjects()
        toast.success('Проект успішно додано!', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
      } catch (error) {
        console.error('Failed to add project', error)
        toast.error('Не вдалося додати проект. Спробуйте ще раз.', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
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

    async removeProject(id: number) {
      const toast = useToast()
      try {
        await deleteProject(id)
        this.projects = this.projects.filter((project) => project.id !== id)
        this.saveProjects()
        toast.success('Проект успішно видалено!', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
      } catch (error) {
        console.error('Failed to delete project', error)
        toast.error('Не вдалося видалити проект. Спробуйте ще раз.', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
      }
    },
  },
})
