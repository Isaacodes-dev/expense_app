import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Income, IncomePayload, IncomeFilters } from '@/types/income';
import { incomeService } from '@/services/incomeService';

export const useIncomeStore = defineStore('incomes', () => {
    const items = ref<Income[]>([]);
    const loading = ref(false);
    const meta = ref<{
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    } | null>(null);

    async function fetchAll(filters?: IncomeFilters) {
        loading.value = true;
        try {
            const response = await incomeService.list(filters);
            items.value = response.data;
            meta.value = response.meta;
        } finally {
            loading.value = false;
        }
    }

    async function create(data: IncomePayload) {
        const response = await incomeService.create(data);
        return response.data;
    }

    async function update(id: number, data: IncomePayload) {
        const response = await incomeService.update(id, data);
        return response.data;
    }

    async function remove(id: number) {
        await incomeService.delete(id);
        items.value = items.value.filter((i) => i.id !== id);
    }

    return { items, loading, meta, fetchAll, create, update, remove };
});
