import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Expense, ExpensePayload, ExpenseFilters } from '@/types/expense';
import { expenseService } from '@/services/expenseService';

export const useExpenseStore = defineStore('expenses', () => {
    const items = ref<Expense[]>([]);
    const loading = ref(false);
    const meta = ref<{
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    } | null>(null);

    async function fetchAll(filters?: ExpenseFilters) {
        loading.value = true;
        try {
            const response = await expenseService.list(filters);
            items.value = response.data;
            meta.value = response.meta;
        } finally {
            loading.value = false;
        }
    }

    async function create(data: ExpensePayload) {
        const response = await expenseService.create(data);
        return response.data;
    }

    async function update(id: number, data: ExpensePayload) {
        const response = await expenseService.update(id, data);
        return response.data;
    }

    async function remove(id: number) {
        await expenseService.delete(id);
        items.value = items.value.filter((e) => e.id !== id);
    }

    return { items, loading, meta, fetchAll, create, update, remove };
});
