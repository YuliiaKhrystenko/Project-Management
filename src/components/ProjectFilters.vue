<template>
  <div class="controls">
    <input 
      type="text" 
      v-model="filters.name" 
      placeholder="Search by name..." 
      class="search-input" 
    />

    <select v-model="filters.status" class="status-select">
      <option value="">All Statuses</option>
      <option v-for="status in projectStatuses" :key="status" :value="status">
        {{ status }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { ProjectStatus } from '@/types/types';

defineProps(['filters']);

const projectStatuses: ProjectStatus[] = ['Active', 'Completed'];
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .search-input {
    font-size: 14px;
    border: none;
    border-bottom: 1px solid #635FC7;
  }

  .search-input:focus {
    outline: none;
  }

  .status-select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    font-size: 16px;
    cursor: pointer;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .status-select:hover {
    border-color: #635FC7;
  }
}
</style>
