<template>
  <div class="task-board">
    <div v-for="status in taskStatuses" :key="status" class="task-section">
      <h2 class="task-status">{{ status }}</h2>
      <div class="task-list" @dragover.prevent @drop="onDropToSection(status)">
        <div 
          v-for="task in tasksByStatus[status]" 
          :key="task.id" 
          class="task" 
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types/Task';
import type { TaskStatus } from '@/types/types';

const props = defineProps<{
  tasks: Task[];
  getUserName: (id: number | string) => string;
  onDragStart: (task: Task) => void;
  onDropToSection: (newStatus: TaskStatus) => void;
}>();

const taskStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

const tasksByStatus = computed(() =>
  taskStatuses.reduce((acc, status) => {
    acc[status] = props.tasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<string, Task[]>)
);
</script>

<style scoped>
.task-board {
  display: flex;
  gap: 16px;
}

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
</style>
