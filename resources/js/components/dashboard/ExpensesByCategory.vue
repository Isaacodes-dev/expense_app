<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '@/utils/formatters';
import { PieChart } from 'lucide-vue-next';

const props = defineProps<{
    items: Array<{
        category_id: number;
        category_name: string;
        total: string;
    }>;
}>();

const total = computed(() =>
    props.items.reduce((sum, i) => sum + parseFloat(i.total), 0)
);

const colors = [
    { bg: 'bg-blue-500', light: 'bg-blue-100' },
    { bg: 'bg-emerald-500', light: 'bg-emerald-100' },
    { bg: 'bg-amber-500', light: 'bg-amber-100' },
    { bg: 'bg-red-500', light: 'bg-red-100' },
    { bg: 'bg-purple-500', light: 'bg-purple-100' },
    { bg: 'bg-pink-500', light: 'bg-pink-100' },
    { bg: 'bg-indigo-500', light: 'bg-indigo-100' },
    { bg: 'bg-teal-500', light: 'bg-teal-100' },
];
</script>

<template>
    <div class="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-center gap-2">
            <PieChart class="h-4 w-4 text-gray-400" :stroke-width="2" />
            <h3 class="text-sm font-semibold text-gray-900">Expenses by Category</h3>
        </div>
        <div v-if="items.length === 0" class="py-8 text-center text-sm text-gray-400">
            No expenses this month.
        </div>
        <div v-else class="space-y-3">
            <div v-for="(item, index) in items" :key="item.category_id" class="group">
                <div class="mb-1.5 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div
                            :class="['h-2.5 w-2.5 rounded-full', colors[index % colors.length].bg]"
                        ></div>
                        <span class="text-[13px] font-medium text-gray-700">
                            {{ item.category_name }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-400">
                            {{ total > 0 ? Math.round((parseFloat(item.total) / total) * 100) : 0 }}%
                        </span>
                        <span class="text-[13px] font-semibold text-gray-800">
                            {{ formatCurrency(parseFloat(item.total)) }}
                        </span>
                    </div>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                        :class="['h-full rounded-full transition-all duration-500', colors[index % colors.length].bg]"
                        :style="{ width: (total > 0 ? (parseFloat(item.total) / total) * 100 : 0) + '%' }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
