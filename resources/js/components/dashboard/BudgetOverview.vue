<script setup lang="ts">
import { formatCurrency } from '@/utils/formatters';
import { Wallet } from 'lucide-vue-next';

defineProps<{
    items: Array<{
        category_name: string;
        budgeted: string;
        actual: string;
        remaining: string;
        percentage: number;
        over_budget: boolean;
    }>;
}>();

function barColor(pct: number): string {
    if (pct > 100) { return 'bg-red-500'; }
    if (pct > 75) { return 'bg-amber-500'; }
    return 'bg-emerald-500';
}

function textColor(pct: number): string {
    if (pct > 100) { return 'text-red-600'; }
    if (pct > 75) { return 'text-amber-600'; }
    return 'text-emerald-600';
}
</script>

<template>
    <div class="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-center gap-2">
            <Wallet class="h-4 w-4 text-gray-400" :stroke-width="2" />
            <h3 class="text-sm font-semibold text-gray-900">Budget vs Actual</h3>
        </div>
        <div v-if="items.length === 0" class="py-8 text-center text-sm text-gray-400">
            No budgets set for this month.
        </div>
        <div v-else class="space-y-4">
            <div v-for="item in items" :key="item.category_name">
                <div class="mb-1.5 flex items-center justify-between">
                    <span class="text-[13px] font-medium text-gray-700">{{ item.category_name }}</span>
                    <div class="flex items-center gap-2">
                        <span :class="['text-xs font-semibold', textColor(item.percentage)]">
                            {{ item.percentage }}%
                        </span>
                        <span class="text-xs text-gray-400">
                            {{ formatCurrency(parseFloat(item.actual)) }} / {{ formatCurrency(parseFloat(item.budgeted)) }}
                        </span>
                    </div>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                        :class="['h-full rounded-full transition-all duration-500', barColor(item.percentage)]"
                        :style="{ width: Math.min(item.percentage, 100) + '%' }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
