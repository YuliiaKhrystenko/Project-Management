<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th 
            v-for="column in columns" 
            :key="column.field" 
            @click="sortBy(column.field)"
            @mouseover="hoveredColumn = column.field" 
            @mouseleave="hoveredColumn = null"
            :title="getTooltip(column.field)" 
            :style="{ width: column.width + 'px' }" 
            class="resizable-header"
          >
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
          <td>{{ new Date(project.createdAt).toLocaleDateString() }}</td>
          <td>
            <button @click.stop="$emit('deleteProject', project.id)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from 'vue';
import { type Project } from '@/types/Project';

const props = defineProps<{
  projects: Project[];
  onDeleteProject: (id: number) => void;
  goToProjectDetails: (id: number) => void;
}>();

const columns = ref([
  { label: 'ID', field: 'id', width: 100 },
  { label: 'Name', field: 'name', width: 200 },
  { label: 'Tasks Count', field: 'tasksCount', width: 150 },
  { label: 'Status', field: 'status', width: 150 },
  { label: 'Created At', field: 'createdAt', width: 200 },
  { label: 'Actions', field: 'actions', width: 100 },
]);

const sortField = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');
const filters = ref({
  name: '',
  status: '',
});
const hoveredColumn = ref<string | null>(null);
const resizingColumn = ref<any>(null);
const startX = ref(0);

function saveSettings() {
  localStorage.setItem('sortField', sortField.value ?? '');
  localStorage.setItem('sortOrder', sortOrder.value);
  localStorage.setItem('filters', JSON.stringify(filters.value));
}

function loadSettings() {
  const savedSortField = localStorage.getItem('sortField');
  const savedSortOrder = localStorage.getItem('sortOrder');
  const savedFilters = localStorage.getItem('filters');

  if (savedSortField) {
    sortField.value = savedSortField;
  }
  if (savedSortOrder) {
    sortOrder.value = savedSortOrder as 'asc' | 'desc';
  }
  if (savedFilters) {
    filters.value = JSON.parse(savedFilters);
  }
}

onMounted(() => {
  loadSettings();
});

const filteredAndSortedProjects = computed(() => {
  let projects = [...props.projects];

  if (filters.value.name) {
    projects = projects.filter(project =>
      project.name.toLowerCase().includes(filters.value.name.toLowerCase())
    );
  }

  if (filters.value.status) {
    projects = projects.filter(project => project.status === filters.value.status);
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
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc';
    } else if (sortOrder.value === 'desc') {
      sortField.value = null;
      sortOrder.value = 'asc';
    }
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }

  saveSettings();
}

function updateFilters(newFilters: { name: string; status: string }) {
  filters.value = newFilters;
  saveSettings();
}

function getTooltip(field: string): string {
  if (sortField.value === field) {
    return sortOrder.value === 'asc'
      ? `Click to sort by ${field} descending`
      : `Click to reset sorting`;
  }
  return `Click to sort by ${field} ascending`;
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

function goToProjectDetails(projectId: number) {
  props.goToProjectDetails(projectId);
}
</script>

<style scoped>
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
  position: relative;
  cursor: pointer;
}

th {
  text-align: center;
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

.delete-button {
  width: 100%;
  background: #EA5555;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  font-size: 12px;
}

.delete-button:hover {
  background: #c0392b;
}
</style>
