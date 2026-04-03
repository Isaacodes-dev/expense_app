<script setup lang="ts">
import { formatCurrency } from '@/utils/formatters';
import { Target } from 'lucide-vue-next';

defineProps<{
    items: Array<{
        id: number;
        name: string;
        target: string;
        saved: string;
        progress_percentage: number;
        deadline: string | null;
    }>;
}>();
</script>

<template>
    <div class="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-center gap-2">
            <Target class="h-4 w-4 text-gray-400" :stroke-width="2" />
            <h3 class="text-sm font-semibold text-gray-900">Savings Goals</h3>
        </div>
        <div v-if="items.length === 0" class="py-8 text-center text-sm text-gray-400">
            No active savings goals.
        </div>
        <div v-else class="space-y-4">
            <div v-for="goal in items" :key="goal.id">
                <div class="mb-1.5 flex items-center justify-between">
                    <span class="text-[13px] font-medium text-gray-700">{{ goal.name }}</span>
                    <span class="text-xs font-semibold text-blue-600">
                        {{ goal.progress_percentage }}%
                    </span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-blue-50">
                    <div
                        class="h-full rounded-full bg-blue-500 transition-all duration-500"
                        :style="{ width: Math.min(goal.progress_percentage, 100) + '%' }"
                    ></div>
                </div>
                <div class="mt-1 flex justify-between text-xs text-gray-400">
                    <span>{{ formatCurrency(parseFloat(goal.saved)) }}</span>
                    <span>{{ formatCurrency(parseFloat(goal.target)) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
