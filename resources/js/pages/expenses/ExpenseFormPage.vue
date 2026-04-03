<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useExpenseStore } from '@/stores/expenses';
import { useCategoryStore } from '@/stores/categories';
import { expenseService } from '@/services/expenseService';
import ExpenseForm from '@/components/forms/ExpenseForm.vue';
import type { Expense, ExpensePayload } from '@/types/expense';
import type { AxiosError } from 'axios';
import { useNotificationStore } from '@/composables/useNotification';

const route = useRoute();
const router = useRouter();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();
const notify = useNotificationStore();

const expenseId = computed(() =>
    route.params.id ? Number(route.params.id) : null,
);
const isEditing = computed(() => expenseId.value !== null);

const expense = ref<Expense | null>(null);
const loading = ref(false);
const saving = ref(false);
const errors = ref<Record<string, string[]>>({});
const generalError = ref('');

onMounted(async () => {
    loading.value = true;

    try {
        // Load categories and expense data in parallel
        const promises: Promise<unknown>[] = [];

        if (categoryStore.items.length === 0) {
            promises.push(categoryStore.fetchAll(true));
        }

        if (isEditing.value) {
            promises.push(
                expenseService.get(expenseId.value!).then((response) => {
                    expense.value = response.data;
                }),
            );
        }

        await Promise.all(promises);
    } finally {
        loading.value = false;
    }
});

async function handleSubmit(data: ExpensePayload) {
    saving.value = true;
    errors.value = {};
    generalError.value = '';

    try {
        if (isEditing.value) {
            await expenseStore.update(expenseId.value!, data);
            notify.success('Expense Updated', 'Expense has been updated.');
        } else {
            await expenseStore.create(data);
            notify.success('Expense Added', 'Expense has been recorded.');
        }

        router.push('/expenses');
    } catch (err) {
        const error = err as AxiosError<{
            message?: string;
            errors?: Record<string, string[]>;
        }>;

        if (error.response?.status === 422 && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            generalError.value =
                error.response?.data?.message ||
                'Something went wrong. Please try again.';
            notify.error('Error', generalError.value);
        }
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <div>
        <h1 class="mb-6 text-2xl font-semibold text-gray-900">
            {{ isEditing ? 'Edit Expense' : 'Add Expense' }}
        </h1>
        <div
            v-if="generalError"
            class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
            {{ generalError }}
        </div>

        <div v-if="loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>
        <ExpenseForm v-else :expense="expense" :loading="saving" :errors="errors" @submit="handleSubmit" />
    </div>
</template>
