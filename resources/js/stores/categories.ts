import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Category, CategoryPayload } from '@/types/category';
import { categoryService } from '@/services/categoryService';

export const useCategoryStore = defineStore('categories', () => {
    const items = ref<Category[]>([]);
    const loading = ref(false);

    async function fetchAll(activeOnly = false) {
        loading.value = true;
        try {
            const response = await categoryService.list(
                activeOnly ? { active_only: true } : undefined
            );
            items.value = response.data;
        } finally {
            loading.value = false;
        }
    }

    async function create(data: CategoryPayload) {
        const response = await categoryService.create(data);
        items.value.push(response.data);
        return response.data;
    }

    async function update(id: number, data: CategoryPayload) {
        const response = await categoryService.update(id, data);
        const index = items.value.findIndex((c) => c.id === id);
        if (index !== -1) {
            items.value[index] = response.data;
        }
        return response.data;
    }

    async function remove(id: number) {
        await categoryService.delete(id);
        items.value = items.value.filter((c) => c.id !== id);
    }

    return { items, loading, fetchAll, create, update, remove };
});
