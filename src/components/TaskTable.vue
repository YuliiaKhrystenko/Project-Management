<template>
  <table class="task-table">
    <thead>
      <tr>
        <th 
          v-for="column in columns" 
          :key="column.field"
           @click="sortBy(column.field)"
          :style="{ width: column.width + 'px' }" c
          lass="resizable-header"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTasksStore } from '@/stores/tasks';

defineProps<{
  tasks: any[];
  getUserName: (id: number | string) => string;
}>();

const sortField = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');

const columns = ref([
  { label: 'ID', field: 'id', width: 100 },
  { label: 'Назва', field: 'name', width: 200 },
  { label: 'Виконавець', field: 'assignee', width: 200 },
  { label: 'Статус', field: 'status', width: 150 },
  { label: 'Термін виконання', field: 'dueDate', width: 200 },
]);

const tasksStore = useTasksStore();

const filters = ref({
  assignee: '',
  status: '',
});

const filteredTasks = computed(() => {
  return tasksStore.tasks.filter(
    (task) =>
      (!filters.value.assignee || getUserName(task.assignee).includes(filters.value.assignee)) &&
      (!filters.value.status || task.status.includes(filters.value.status))
  );
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
}

const users = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
]);

function getUserName(userId: number | string) {
  if (typeof userId === 'number') {
    return users.value.find((user) => user.id === userId)?.name || 'Unknown';
  } else {
    return userId;
  }
}

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
</script>

<style scoped>
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
