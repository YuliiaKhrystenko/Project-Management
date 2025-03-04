<template>
  <div class="projects-page">
    <div class="header">
      <h1 class="title">Projects</h1>
      <button @click="openModal" class="add-button">+ Add New Project</button>
    </div>

    <ProjectFilters v-model:filters="filters" />

    <ProjectTable 
      v-if="filteredAndSortedProjects.length > 0" 
      :projects="filteredAndSortedProjects" 
      @deleteProject="confirmDeleteProject"
      :goToProjectDetails="goToProjectDetails" 
    />

    <p v-else class="no-projects">Add Your First Project!</p>

    <Modal 
      v-if="isModalOpen" 
      :modalType="'project'" 
      :closeModal="closeModal" 
      :onSubmit="addProject"
      :existingProjects="existingProjects" 
      :existingTasks="existingTasks" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { type Project } from '@/types/Project';

import Modal from '@/components/Modal.vue';
import ProjectFilters from '@/components/ProjectFilters.vue';
import ProjectTable from '@/components/ProjectTable.vue';

const router = useRouter();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();

const filters = ref<{ name: string; status: string }>({ name: '', status: '' });
const sortField = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');
const isModalOpen = ref(false);

const existingProjects = computed(() => projectsStore.projects);
const existingTasks = computed(() => tasksStore.tasks);

const projectsWithTaskCounts = computed(() => {
  const tasks = tasksStore.tasks;

  return projectsStore.projects.map((project) => {
    const taskCount = tasks.filter((task) => task.projectId === project.id).length;
    return {
      ...project,
      tasksCount: taskCount,
    };
  });
});

function loadFiltersFromLocalStorage() {
  const savedFilters = localStorage.getItem('filters');
  if (savedFilters) {
    filters.value = JSON.parse(savedFilters);
  }
}

watch(filters, (newFilters) => {
  localStorage.setItem('filters', JSON.stringify(newFilters));
}, { deep: true });

onMounted(() => {
  projectsStore.fetchProjects();
  tasksStore.loadFromLocalStorage();
  loadFiltersFromLocalStorage();
});

function openModal() {
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
}
function addProject(newProject: Project) {
  projectsStore.addProject(newProject);
}

function confirmDeleteProject(projectId: number) {
  if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
    deleteProject(projectId);
  }
}

async function deleteProject(projectId: number) {
  await projectsStore.removeProject(projectId);
}

const filteredAndSortedProjects = computed(() => {
  let projects = [...projectsWithTaskCounts.value];

  if (filters.value.name) {
    projects = projects.filter((project) =>
      project.name.toLowerCase().includes(filters.value.name.toLowerCase())
    );
  }

  if (filters.value.status) {
    projects = projects.filter((project) => project.status === filters.value.status);
  }

  if (sortField.value) {
    projects.sort((a, b) => {
      const aValue = a[sortField.value as keyof typeof a];
      const bValue = b[sortField.value as keyof typeof b];
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return projects;
});

function goToProjectDetails(projectId: number) {
  router.push({ name: 'ProjectDetails', params: { id: projectId } });
}
</script>

<style lang="scss" scoped>
.projects-page {
  padding: 16px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 32px;
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .no-projects {
    text-align: center;
    font-size: 18px;
    color: #666;
    margin-top: 20px;
  }
}

.add-button {
  background: #635FC7;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

.add-button:hover {
  background: #A8A4FF;
}
</style>
