<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIncomeStore } from '@/stores/incomes';
import { incomeService } from '@/services/incomeService';
import IncomeForm from '@/components/forms/IncomeForm.vue';
import type { Income, IncomePayload } from '@/types/income';
import type { AxiosError } from 'axios';
import { useNotificationStore } from '@/composables/useNotification';

const route = useRoute();
const router = useRouter();
const incomeStore = useIncomeStore();
const notify = useNotificationStore();

const incomeId = computed(() => route.params.id ? Number(route.params.id) : null);
const isEditing = computed(() => incomeId.value !== null);

const income = ref<Income | null>(null);
const loading = ref(false);
const saving = ref(false);
const errors = ref<Record<string, string[]>>({});
const generalError = ref('');

onMounted(async () => {
    if (isEditing.value) {
        loading.value = true;

        try {
            const response = await incomeService.get(incomeId.value!);
            income.value = response.data;
        } finally {
            loading.value = false;
        }
    }
});

async function handleSubmit(data: IncomePayload) {
    saving.value = true;
    errors.value = {};
    generalError.value = '';

    try {
        if (isEditing.value) {
            await incomeStore.update(incomeId.value!, data);
            notify.success('Income Updated', 'Income record has been updated.');
        } else {
            await incomeStore.create(data);
            notify.success('Income Added', 'Income record has been saved.');
        }

        router.push('/incomes');
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
            {{ isEditing ? 'Edit Income' : 'Add Income' }}
        </h1>
        <div
            v-if="generalError"
            class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
            {{ generalError }}
        </div>

        <div v-if="loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>
        <IncomeForm v-else :income="income" :loading="saving" :errors="errors" @submit="handleSubmit" />
    </div>
</template>
