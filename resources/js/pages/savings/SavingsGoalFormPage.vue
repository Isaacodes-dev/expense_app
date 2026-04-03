<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSavingsGoalStore } from '@/stores/savingsGoals';
import { savingsGoalService } from '@/services/savingsGoalService';
import SavingsGoalForm from '@/components/forms/SavingsGoalForm.vue';
import type { SavingsGoal, SavingsGoalPayload } from '@/types/savings';
import type { AxiosError } from 'axios';
import { useNotificationStore } from '@/composables/useNotification';

const route = useRoute();
const router = useRouter();
const goalStore = useSavingsGoalStore();
const notify = useNotificationStore();

const goalId = computed(() => route.params.id ? Number(route.params.id) : null);
const isEditing = computed(() => goalId.value !== null);
const goal = ref<SavingsGoal | null>(null);
const loading = ref(false);
const saving = ref(false);
const errors = ref<Record<string, string[]>>({});

onMounted(async () => {
    if (isEditing.value) {
        loading.value = true;
        try { const r = await savingsGoalService.get(goalId.value!); goal.value = r.data; }
        finally { loading.value = false; }
    }
});

async function handleSubmit(data: SavingsGoalPayload) {
    saving.value = true; errors.value = {};
    try {
        if (isEditing.value) {
            await goalStore.update(goalId.value!, data);
            notify.success('Goal Updated', 'Savings goal has been updated.');
        } else {
            await goalStore.create(data);
            notify.success('Goal Created', 'Savings goal has been added.');
        }
        router.push('/savings');
    } catch (err) {
        const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
        if (error.response?.status === 422 && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            notify.error('Error', 'Failed to save savings goal.');
        }
    } finally { saving.value = false; }
}
</script>

<template>
    <div>
        <h1 class="mb-6 text-2xl font-semibold text-gray-900">{{ isEditing ? 'Edit Savings Goal' : 'Create Savings Goal' }}</h1>
        <div v-if="loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>
        <SavingsGoalForm v-else :goal="goal" :loading="saving" :errors="errors" @submit="handleSubmit" />
    </div>
</template>
