<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { SavingsGoal, SavingsGoalPayload } from '@/types/savings';

const props = defineProps<{
    goal?: SavingsGoal | null;
    loading?: boolean;
    errors?: Record<string, string[]>;
}>();

const emit = defineEmits<{ submit: [data: SavingsGoalPayload] }>();

const form = reactive<SavingsGoalPayload>({
    name: '',
    target_amount: 0,
    deadline: '',
    status: 'active',
    description: '',
});

watch(() => props.goal, (g) => {
    if (g) {
        form.name = g.name;
        form.target_amount = parseFloat(g.target_amount);
        form.deadline = g.deadline || '';
        form.status = g.status;
        form.description = g.description || '';
    }
}, { immediate: true });

function handleSubmit() { emit('submit', { ...form, deadline: form.deadline || null }); }
</script>

<template>
    <form @submit.prevent="handleSubmit" class="max-w-lg space-y-4">
        <div>
            <label for="name" class="mb-1 block text-sm font-medium text-gray-700">Goal Name</label>
            <input id="name" v-model="form.name" type="text" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
        </div>

        <div>
            <label for="target_amount" class="mb-1 block text-sm font-medium text-gray-700">Target Amount</label>
            <input id="target_amount" v-model.number="form.target_amount" type="number" step="0.01" min="0.01" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.target_amount" class="mt-1 text-sm text-red-600">{{ errors.target_amount[0] }}</p>
        </div>

        <div>
            <label for="deadline" class="mb-1 block text-sm font-medium text-gray-700">Deadline (optional)</label>
            <input id="deadline" v-model="form.deadline" type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
        </div>

        <div v-if="goal">
            <label for="status" class="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select id="status" v-model="form.status"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none">
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>

        <div>
            <label for="description" class="mb-1 block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea id="description" v-model="form.description" rows="3"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"></textarea>
        </div>

        <div class="flex items-center gap-3 pt-4">
            <button type="submit" :disabled="loading"
                class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                {{ loading ? 'Saving...' : (goal ? 'Update Goal' : 'Create Goal') }}
            </button>
            <router-link to="/savings" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</router-link>
        </div>
    </form>
</template>
