<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '@/utils/formatters';
import {
    TrendingUp,
    TrendingDown,
    PiggyBank,
    Scale,
} from 'lucide-vue-next';

const props = defineProps<{
    income: string;
    expenses: string;
    savings: string;
    carriedForward: string;
    balance: string;
}>();

const hasCarriedForward = computed(
    () => parseFloat(props.carriedForward) !== 0,
);

const cards = computed(() => [
    {
        label: 'Income',
        value: props.income,
        icon: TrendingUp,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
        sub: null,
    },
    {
        label: 'Expenses',
        value: props.expenses,
        icon: TrendingDown,
        color: 'text-red-600',
        bg: 'bg-red-50',
        iconColor: 'text-red-500',
        sub: null,
    },
    {
        label: 'Savings',
        value: props.savings,
        icon: PiggyBank,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        sub: null,
    },
    {
        label: 'Balance',
        value: props.balance,
        icon: Scale,
        color:
            parseFloat(props.balance) >= 0
                ? 'text-gray-900'
                : 'text-red-600',
        bg:
            parseFloat(props.balance) >= 0
                ? 'bg-gray-100'
                : 'bg-red-50',
        iconColor:
            parseFloat(props.balance) >= 0
                ? 'text-gray-500'
                : 'text-red-500',
        sub: hasCarriedForward.value
            ? `B/F: ${formatCurrency(parseFloat(props.carriedForward))}`
            : null,
    },
]);
</script>

<template>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
            v-for="card in cards"
            :key="card.label"
            class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
            <div class="flex items-center justify-between">
                <p class="text-[13px] font-medium text-gray-500">
                    {{ card.label }}
                </p>
                <div
                    :class="[
                        'flex h-9 w-9 items-center justify-center rounded-xl',
                        card.bg,
                    ]"
                >
                    <component
                        :is="card.icon"
                        :class="['h-[18px] w-[18px]', card.iconColor]"
                        :stroke-width="2"
                    />
                </div>
            </div>
            <p
                :class="[
                    'mt-2 text-2xl font-bold tracking-tight',
                    card.color,
                ]"
            >
                {{ formatCurrency(parseFloat(card.value)) }}
            </p>
            <p v-if="card.sub" class="mt-1 text-xs text-gray-400">
                {{ card.sub }}
            </p>
        </div>
    </div>
</template>
