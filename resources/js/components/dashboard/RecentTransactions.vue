<script setup lang="ts">
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-vue-next';

defineProps<{
    items: Array<{
        id: number;
        type: 'income' | 'expense';
        date: string;
        description: string;
        amount: string;
        category: string | null;
    }>;
}>();
</script>

<template>
    <div class="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
        <div class="mb-5 flex items-center gap-2">
            <Receipt class="h-4 w-4 text-gray-400" :stroke-width="2" />
            <h3 class="text-sm font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div v-if="items.length === 0" class="py-8 text-center text-sm text-gray-400">
            No transactions yet.
        </div>
        <div v-else class="space-y-1">
            <div
                v-for="tx in items"
                :key="`${tx.type}-${tx.id}`"
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50"
            >
                <div
                    :class="[
                        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl',
                        tx.type === 'income' ? 'bg-emerald-50' : 'bg-red-50',
                    ]"
                >
                    <ArrowUpRight
                        v-if="tx.type === 'income'"
                        class="h-4 w-4 text-emerald-500"
                        :stroke-width="2.5"
                    />
                    <ArrowDownRight
                        v-else
                        class="h-4 w-4 text-red-500"
                        :stroke-width="2.5"
                    />
                </div>
                <div class="min-w-0 flex-1">
                    <p class="truncate text-[13px] font-medium text-gray-800">
                        {{ tx.description }}
                    </p>
                    <p class="text-xs text-gray-400">
                        {{ formatDate(tx.date) }}
                        <span v-if="tx.category"> &middot; {{ tx.category }}</span>
                    </p>
                </div>
                <span
                    :class="[
                        'text-sm font-semibold tabular-nums',
                        tx.type === 'income' ? 'text-emerald-600' : 'text-red-600',
                    ]"
                >
                    {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(parseFloat(tx.amount)) }}
                </span>
            </div>
        </div>
    </div>
</template>
