<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budgets';
import { budgetService } from '@/services/budgetService';
import BudgetForm from '@/components/forms/BudgetForm.vue';
import type { Budget, BudgetPayload } from '@/types/budget';
import type { AxiosError } from 'axios';
import { useNotificationStore } from '@/composables/useNotification';

const route = useRoute();
const router = useRouter();
const budgetStore = useBudgetStore();
const notify = useNotificationStore();

const budgetId = computed(() => route.params.id ? Number(route.params.id) : null);
const isEditing = computed(() => budgetId.value !== null);
const budget = ref<Budget | null>(null);
const loading = ref(false);
const saving = ref(false);
const errors = ref<Record<string, string[]>>({});

onMounted(async () => {
    if (isEditing.value) {
        loading.value = true;
        try { const r = await budgetService.get(budgetId.value!); budget.value = r.data; }
        finally { loading.value = false; }
    }
});

async function handleSubmit(data: BudgetPayload) {
    saving.value = true; errors.value = {};
    try {
        if (isEditing.value) {
            await budgetStore.update(budgetId.value!, { amount: data.amount });
            notify.success('Budget Updated', 'Budget amount has been updated.');
        } else {
            await budgetStore.create(data);
            notify.success('Budget Created', 'Budget has been set.');
        }
        router.push('/budgets');
    } catch (err) {
        const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
        if (error.response?.status === 422 && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            notify.error('Error', 'Failed to save budget.');
        }
    } finally { saving.value = false; }
}
</script>

<template>
    <div>
        <h1 class="mb-6 text-2xl font-semibold text-gray-900">{{ isEditing ? 'Edit Budget' : 'Create Budget' }}</h1>
        <div v-if="loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>
        <BudgetForm v-else :budget="budget" :loading="saving" :errors="errors" @submit="handleSubmit" />
    </div>
</template>
