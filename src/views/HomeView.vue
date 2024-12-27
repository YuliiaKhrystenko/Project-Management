<template>
  <div class="projects-page">
    <h1>Projects</h1>

    <div class="controls">
      <div class="controls-filetrs">
        <input type="text" v-model="filters.name" placeholder="Search by name" class="search-input" />
        <select v-model="filters.status" class="status-select">
          <option value="">All Statuses</option>
          <option v-for="status in projectStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
      <div class="controls-addBtn">
        <button @click="openModal" class="add-button">Add Project</button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.field" @click="sortBy(column.field)"
              :style="{ width: column.width + 'px' }" class="resizable-header">
              <span>{{ column.label }}</span>
              <span class="sort-indicator">
                {{ sortField === column.field ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </span>
              <span class="resize-handle" @mousedown="startResize($event, column)"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredAndSortedProjects" :key="project.id" @click="goToProjectDetails(project.id)">
            <td>{{ project.id }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.tasksCount }}</td>
            <td>{{ project.status }}</td>
            <td>{{ formatDate(project.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal v-if="isModalOpen" :modalType="'project'" :closeModal="closeModal" :onSubmit="addProject" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import type { ProjectStatus } from '@/types/types';
import { type Project } from '@/types/Project';
import Modal from '@/components/Modal.vue';

const router = useRouter();
const projectsStore = useProjectsStore();

const filters = ref({ name: '', status: '' });
const sortField = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');
const isModalOpen = ref(false);

const resizingColumn = ref<any>(null);
const startX = ref(0);

const projectStatuses: ProjectStatus[] = ['Active', 'Completed'];

onMounted(() => {
  projectsStore.fetchProjects();
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

const columns = ref([
  { label: 'ID', field: 'id', width: 100 },
  { label: 'Name', field: 'name', width: 200 },
  { label: 'Tasks Count', field: 'tasksCount', width: 150 },
  { label: 'Status', field: 'status', width: 150 },
  { label: 'Created At', field: 'createdAt', width: 200 },
]);

const filteredAndSortedProjects = computed(() => {
  let projects = [...projectsStore.projects];

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

function sortBy(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
}

function goToProjectDetails(projectId: number) {
  router.push({ name: 'ProjectDetails', params: { id: projectId } });
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

function startResize(event: MouseEvent, column: any) {
  resizingColumn.value = column;
  startX.value = event.clientX;
  document.addEventListener('mousemove', resizeColumn);
  document.addEventListener('mouseup', stopResize);
}
function resizeColumn(event: MouseEvent) {
  if (resizingColumn.value) {
    const deltaX = event.clientX - startX.value;
    startX.value = event.clientX;
    resizingColumn.value.width += deltaX;
  }
}
function stopResize() {
  document.removeEventListener('mousemove', resizeColumn);
  document.removeEventListener('mouseup', stopResize);
  resizingColumn.value = null;
}

</script>

<style scoped>
.projects-page {
  padding: 16px;
}

.controls {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input,
.status-select,
.add-button {
  padding: 8px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  position: relative;
}

.resizable-header {
  cursor: pointer;
  user-select: none;
}

.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
}

.add-button {
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.add-button:hover {
  background: #218838;
}
</style>
