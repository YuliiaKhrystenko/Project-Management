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

    saveToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    saveTasks() {
      this.saveToLocalStorage()
    },

    async fetchTasks(projectId: number) {
      try {
        this.tasks = await getTasksByProject(projectId)
        this.saveTasks()
      } catch (error) {
        console.error('Failed to fetch tasks', error)
      }
    },

    async addTask(newTask: Omit<Task, 'id'>) {
      try {
        const task = await createTask(newTask)
        this.tasks.push(task)
        this.saveTasks()
      } catch (error) {
        console.error('Failed to add task', error)
      }
    },

    async updateTask(id: number, updatedFields: Partial<Task>) {
      try {
        const updatedTask = await updateTask(id, updatedFields)
        this.tasks = this.tasks.map((task) =>
          task.id === id ? { ...task, ...updatedFields } : task,
        )
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
