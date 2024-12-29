<template>
  <div class="project-page">
    <div class="header">
      <h1 class="title">Project: {{ project?.name || 'Loading...' }}</h1>
      <button @click="openModal" v-if="project" class="add-button">Add Task</button>
    </div>

    <div v-if="project">
      <table class="task-table">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.field" 
              @click="sortBy(column.field)"
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
          <tr v-for="task in filteredTasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.name }}</td>
            <td>{{ getUserName(task.assignee) }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.dueDate }}</td>
          </tr>
        </tbody>
      </table>

      <div class="task-board">
        <div v-for="status in taskStatuses" :key="status" class="task-section">
          <h2 class="task-status">{{ status }}</h2>
          <div class="task-list" @dragover.prevent @drop="onDropToSection(status)">
            <div 
              v-for="task in tasksByStatus[status]" 
              :key="task.id" class="task" 
              draggable="true"
              @dragstart="onDragStart(task)"
            >
              <span>{{ task.name }}</span>
              <span>{{ getUserName(task.assignee) }}</span>
              <span>{{ task.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>
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

const route = useRoute();
const projectId = Number(route.params.id);

const tasksStore = useTasksStore();
const project = ref<Project | null>(null);
const isModalOpen = ref(false);
const draggedTask = ref<Task | null>(null);

const taskStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

const sortField = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');
const filters = ref({
  assignee: '',
  status: '',
});
const tasksByStatus = computed(() =>
  taskStatuses.reduce((acc, status) => {
    acc[status] = tasksStore.tasks.filter((task) => task.status === status && task.projectId === projectId);
    return acc;
  }, {} as Record<string, Task[]>)
);
const filteredTasks = computed(() => {
  return tasksStore.tasks.filter(
    (task) =>
      (!filters.value.assignee || getUserName(task.assignee).includes(filters.value.assignee)) &&
      (!filters.value.status || task.status.includes(filters.value.status))
  );
});

function sortBy(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field as keyof Task;
    sortOrder.value = 'asc';
  }
}

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

const columns = ref([
  { label: 'ID', field: 'id', width: 100 },
  { label: 'Назва', field: 'name', width: 200 },
  { label: 'Виконавець', field: 'assignee', width: 200 },
  { label: 'Статус', field: 'status', width: 150 },
  { label: 'Термін виконання', field: 'dueDate', width: 200 },
]);

const resizingColumn = ref<any>(null);
const startX = ref(0);

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

function onDragStart(task: Task) {
  draggedTask.value = task;
}

async function onDropToSection(newStatus: TaskStatus) {
  if (draggedTask.value && draggedTask.value.status !== newStatus) {
    await tasksStore.updateTask(draggedTask.value.id, { status: newStatus });
    draggedTask.value = null;
  }
}

function getUserName(userId: number | string) {
  if (typeof userId === 'number') {
    return users.value.find((user) => user.id === userId)?.name || 'Unknown';
  } else {
    return userId;
  }
}

onMounted(async () => {
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

<style scoped>
.project-page {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .task-board {
    display: flex;
    gap: 16px;

    .task-section {
      flex: 1;
      background: #f9f9f9;
      padding: 16px;
      border: 1px solid #ddd;
    }   
    .task-status {
      text-align: center;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd; 
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1e293b;
    }
  }
  
  .task-list {
    min-height: 100px;
  }

  .task {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: #fff;
    border: 1px solid #ddd;
    margin-bottom: 8px;
    cursor: move;
  }

  .task-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
  }

  .task-table th,
  .task-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .task-table th {
    cursor: pointer;
    background: #f1f1f1;
    position: relative;
  }
}

.sort-indicator {
  margin-left: 4px;
}

.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
}

.resizable-header {
  cursor: pointer;
  user-select: none;
}
</style>
