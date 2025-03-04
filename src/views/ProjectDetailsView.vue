<template>
  <div class="project-page">
    <div class="header">
      <router-link to="/" class="back-button">⬅ Back</router-link>
      <h1 class="title">{{ project?.name || 'Loading...' }}</h1>
      <button @click="openModal" v-if="project" class="add-button">+ Add New Task</button>
    </div>

    <div v-if="project">
      <TaskTable :tasks="filteredTasks" :getUserName="getUserName" />
      <TaskStatusBoard 
        :tasks="filteredTasks" 
        :getUserName="getUserName" 
        :onDragStart="onDragStart"
        :onDropToSection="onDropToSection" 
      />
    </div>
    <p v-else>Loading project details...</p>

    <Modal 
      v-if="isModalOpen" 
      :modalType="'task'" 
      :closeModal="closeModal" 
      :onSubmit="addTask" 
      :users="users"
      :existingProjects="[]" 
      :existingTasks="tasksStore.tasks" 
      :currentProjectId="projectId" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTasksStore } from '@/stores/tasks';
import { getProjects } from '@/services/projectService';
import { type Task } from '@/types/Task';
import { type Project } from '@/types/Project';
import type { TaskStatus } from '@/types/types';
import Modal from '@/components/Modal.vue';
import TaskTable from '@/components/TaskTable.vue';
import TaskStatusBoard from '@/components/TaskStatusBoard.vue';

const route = useRoute();
const projectId = Number(route.params.id);
const tasksStore = useTasksStore();
const project = ref<Project | null>(null);
const isModalOpen = ref(false);
const draggedTask = ref<Task | null>(null);

const filteredTasks = computed(() => tasksStore.tasks.filter(task => task.projectId === projectId));

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function addTask(newTask: Partial<Task>) {
  const newId = tasksStore.tasks.length + 1;
  await tasksStore.addTask({ ...newTask, id: newId, projectId } as Task);
}

const users = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
]);

function getUserName(userId: number | string) {
  return users.value.find((user) => user.id === userId)?.name || 'Unknown';
}

function onDragStart(task: Task) {
  draggedTask.value = task;
}

async function onDropToSection(newStatus: TaskStatus) {
  if (draggedTask.value && draggedTask.value.status !== newStatus) {
    await tasksStore.updateTask(draggedTask.value.id, { status: newStatus });
    draggedTask.value = null;
  }
}

onMounted(async () => {
  tasksStore.loadFromLocalStorage();
  const projects = await getProjects();
  const selectedProject = projects.find((proj) => Number(proj.id) === projectId);
  project.value = selectedProject || null;

  if (project.value) {
    await tasksStore.fetchTasks(projectId);
  } else {
    console.log('Project not found');
  }
});
</script>

<style lang="scss" scoped>
.project-page {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .add-button {
    background: #635FC7;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
  }

  .add-button:hover {
    background: #A8A4FF;
  }
}

.back-button {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
}

.back-button:hover {
  background: #2980b9;
}
</style>
