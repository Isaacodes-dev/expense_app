import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
    dashboardService,
    type DashboardData,
} from '@/services/dashboardService';

export const useDashboardStore = defineStore('dashboard', () => {
    const data = ref<DashboardData | null>(null);
    const loading = ref(false);

    async function fetch(month?: number, year?: number) {
        loading.value = true;
        try {
            const response = await dashboardService.get({ month, year });
            data.value = response.data;
        } finally {
            loading.value = false;
        }
    }

    return { data, loading, fetch };
});
