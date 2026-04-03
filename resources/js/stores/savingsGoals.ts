import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { SavingsGoal, SavingsGoalPayload } from '@/types/savings';
import { savingsGoalService } from '@/services/savingsGoalService';

export const useSavingsGoalStore = defineStore('savingsGoals', () => {
    const items = ref<SavingsGoal[]>([]);
    const loading = ref(false);

    async function fetchAll(status?: string) {
        loading.value = true;
        try {
            const response = await savingsGoalService.list(status ? { status } : undefined);
            items.value = response.data;
        } finally {
            loading.value = false;
        }
    }

    async function create(data: SavingsGoalPayload) {
        const response = await savingsGoalService.create(data);
        items.value.unshift(response.data);
        return response.data;
    }

    async function update(id: number, data: Partial<SavingsGoalPayload>) {
        const response = await savingsGoalService.update(id, data);
        const index = items.value.findIndex((g) => g.id === id);
        if (index !== -1) { items.value[index] = response.data; }
        return response.data;
    }

    async function remove(id: number) {
        await savingsGoalService.delete(id);
        items.value = items.value.filter((g) => g.id !== id);
    }

    return { items, loading, fetchAll, create, update, remove };
});
