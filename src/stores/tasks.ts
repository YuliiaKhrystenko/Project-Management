import { defineStore } from 'pinia'
import { type Task } from '@/types/Task'
import { getTasksByProject, createTask, updateTask, deleteTask } from '@/services/taskService'

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
        this.tasks = await getTasksByProject(projectId)
        this.saveTasks()
      } catch (error) {
        console.error('Failed to fetch tasks', error)
      }
    },

    async addTask(newTask: Task) {
      try {
        this.tasks.push(newTask)
        this.saveTasks()
      } catch (error) {
        console.error('Failed to add task', error)
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
      try {
        await deleteTask(id)
        this.tasks = this.tasks.filter((task) => task.id !== id)
        this.saveTasks()
      } catch (error) {
        console.error('Failed to delete task', error)
      }
    },

    async sortTasks(field: keyof Task) {
      this.tasks.sort((a, b) => (a[field] > b[field] ? 1 : -1))
      this.saveTasks()
    },
  },
})
