<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <h2>{{ modalType === 'project' ? 'Add New Project' : 'Add New Task' }}</h2>
            <form @submit.prevent="submitForm">

                <div class="form-group" v-if="modalType === 'project' || modalType === 'task'">
                    <label for="name">
                        {{ modalType === 'project' ? 'Project Name' : 'Task Name' }}
                        <span class="required">*</span>
                    </label>
                    <input type="text" id="name" v-model="formData.name"
                        :placeholder="modalType === 'project' ? 'Enter project name' : 'Enter task name'" required />
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
import { ref, computed } from 'vue';

const props = defineProps<{
    closeModal: () => void;
    modalType: 'project' | 'task';
    onSubmit: (data: any) => void;
    users?: { id: number; name: string }[];
}>();

const formData = ref({
    name: '',
    description: '',
    assignee: null,
    status: props.modalType === 'project' ? 'Active' : 'To Do',
    deadline: '',
    createdAt: props.modalType === 'project' ? new Date().toISOString() : '',
});

const isFormValid = computed(() => {
    if (props.modalType === 'project') {
        return formData.value.name.trim() !== '' && formData.value.status;
    }
    if (props.modalType === 'task') {
        return (
            formData.value.name.trim() !== '' &&
            formData.value.status &&
            formData.value.deadline
        );
    }
    return false;
});

function submitForm() {
    props.onSubmit(formData.value);
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
textarea {
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
