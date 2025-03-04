import { defineStore } from 'pinia'
import { type Task } from '@/types/Task'
import { getTasksByProject, createTask, updateTask, deleteTask } from '@/services/taskService'
import { POSITION, useToast } from 'vue-toastification'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
  }),

  actions: {
    loadFromLocalStorage() {
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        try {
          this.tasks = JSON.parse(storedTasks) as Task[]
        } catch (error) {
          console.error('Failed to parse tasks from localStorage', error)
          this.tasks = []
        }
      }
    },

    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    async fetchTasks(projectId: number) {
      try {
        const apiTasks = await getTasksByProject(projectId)
        this.loadFromLocalStorage()

        const localTasks = this.tasks.filter((task) => task.projectId === projectId)
        const mergedTasks = [...apiTasks]

        localTasks.forEach((localTask) => {
          if (!mergedTasks.some((apiTask) => apiTask.id === localTask.id)) {
            mergedTasks.push(localTask)
          }
        })

        this.tasks = mergedTasks
        this.saveTasks()
      } catch (error) {
        console.error('Failed to fetch tasks', error)
      }
    },

    async addTask(newTask: Task) {
      const toast = useToast()
      try {
        this.tasks.push(newTask)
        this.saveTasks()
        toast.success('Завдання успішно додано!', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
      } catch (error) {
        console.error('Failed to add task', error)
        toast.error('Не вдалося додати завдання. Спробуйте ще раз.', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
      }
    },

    async updateTask(id: number, updatedFields: Partial<Task>) {
      try {
        const taskIndex = this.tasks.findIndex((task) => task.id === id)
        if (taskIndex === -1) throw new Error('Task not found')

        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedFields }
        this.saveTasks()
      } catch (error) {
        console.error('Failed to update task', error)
      }
    },

    async deleteTask(id: number) {
      const toast = useToast()
      try {
        await deleteTask(id)
        this.tasks = this.tasks.filter((task) => task.id !== id)
        this.saveTasks()
        toast.success('Завдання успішно видалено!', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
      } catch (error) {
        console.error('Failed to delete task', error)
        toast.error('Не вдалося видалити завдання. Спробуйте ще раз.', {
          timeout: 3000,
          position: POSITION.TOP_LEFT,
        })
      }
    },

    async sortTasks(field: keyof Task) {
      this.tasks.sort((a, b) => (a[field] > b[field] ? 1 : -1))
      this.saveTasks()
    },
  },
})
