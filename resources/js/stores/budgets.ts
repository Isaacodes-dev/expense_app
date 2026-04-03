import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Budget, BudgetPayload } from '@/types/budget';
import { budgetService } from '@/services/budgetService';

export const useBudgetStore = defineStore('budgets', () => {
    const items = ref<Budget[]>([]);
    const loading = ref(false);

    async function fetchAll(month?: number, year?: number) {
        loading.value = true;
        try {
            const response = await budgetService.list({ month, year });
            items.value = response.data;
        } finally {
            loading.value = false;
        }
    }

    async function create(data: BudgetPayload) {
        const response = await budgetService.create(data);
        items.value.push(response.data);
        return response.data;
    }

    async function update(id: number, data: Partial<BudgetPayload>) {
        const response = await budgetService.update(id, data);
        const index = items.value.findIndex((b) => b.id === id);
        if (index !== -1) { items.value[index] = response.data; }
        return response.data;
    }

    async function remove(id: number) {
        await budgetService.delete(id);
        items.value = items.value.filter((b) => b.id !== id);
    }

    return { items, loading, fetchAll, create, update, remove };
});
