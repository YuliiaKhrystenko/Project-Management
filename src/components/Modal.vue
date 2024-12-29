<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <h2>{{ modalType === 'project' ? 'Add New Project' : 'Add New Task' }}</h2>
            <form @submit.prevent="submitForm">

                <div class="form-group">
                    <label for="name">
                        {{ modalType === 'project' ? 'Project Name' : 'Task Name' }}
                        <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        v-model="formData.name"
                        :placeholder="modalType === 'project' ? 'Enter project name' : 'Enter task name'" 
                        required 
                    />
                </div>

                <div class="form-group" v-if="modalType === 'project'">
                    <label for="description">Description</label>
                    <input id="description" v-model="formData.description" placeholder="Enter project description" />
                </div>

                <div class="form-group" v-if="modalType === 'task'">
                    <label for="assignee">Assignee</label>
                    <select id="assignee" v-model="formData.assignee">
                        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" v-model="formData.status" required>
                        <option v-if="modalType === 'project'" value="Active">Active</option>
                        <option v-if="modalType === 'project'" value="Completed">Completed</option>
                        <option v-if="modalType === 'task'" value="To Do">To Do</option>
                        <option v-if="modalType === 'task'" value="In Progress">In Progress</option>
                        <option v-if="modalType === 'task'" value="Done">Done</option>
                    </select>
                </div>

                <div class="form-group" v-if="modalType === 'task'">
                    <label for="deadline">Deadline</label>
                    <input type="date" id="deadline" v-model="formData.deadline" required />
                </div>

                <div class="form-actions">
                    <button type="button" @click="closeModal">Cancel</button>
                    <button type="submit" :disabled="!isFormValid">Save</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
    closeModal: () => void;
    modalType: 'project' | 'task';
    onSubmit: (data: any) => void;
    existingProjects: { id: number; name: string; }[];
    existingTasks: { id: number; name: string; projectId: number; }[];
    users?: { id: number; name: string; }[];
    currentProjectId?: number;
}>();

const formData = ref<any>({});

watch(
    () => props.modalType,
    (newType) => {
        formData.value = newType === 'project'
            ? {
                name: '',
                description: '',
                tasksCount: 0,
                status: 'Active',
                createdAt: new Date().toISOString(),
            }
            : {
                name: '',
                assignee: null,
                status: 'To Do',
                deadline: '',
                projectId: props.currentProjectId || null,
            };
    },
    { immediate: true }
);

const generateUniqueId = (existing: { id: number }[]) => {
    if (!existing || existing.length === 0) return 1;
    return Math.max(...existing.map((item) => item.id)) + 1;
};

const isFormValid = computed(() => {
    if (props.modalType === 'project') {
        return formData.value.name.trim() !== '' && formData.value.status;
    }
    if (props.modalType === 'task') {
        return (
            formData.value.name.trim() !== '' &&
            formData.value.status &&
            formData.value.deadline &&
            formData.value.projectId
        );
    }
    return false;
});

function submitForm() {
    const newId = generateUniqueId(
        props.modalType === 'project' ? props.existingProjects : props.existingTasks
    );

    const cleanedData = props.modalType === 'project'
        ? {
            id: newId,
            name: formData.value.name,
            description: formData.value.description,
            tasksCount: formData.value.tasksCount,
            status: formData.value.status,
            createdAt: formData.value.createdAt,
        }
        : {
            id: newId,
            name: formData.value.name,
            assignee: formData.value.assignee,
            status: formData.value.status,
            dueDate: formData.value.deadline,
            projectId: formData.value.projectId,
        };

    props.onSubmit(cleanedData);
    props.closeModal();
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
    margin-top: 0;
}

.form-group {
    margin-bottom: 16px;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
}

.required {
    color: red;
}

input,
textarea,
select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

textarea {
    resize: vertical;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button[type='submit'] {
    background: #007bff;
    color: #fff;
}

button[disabled] {
    background: #ccc;
    cursor: not-allowed;
}
</style>
