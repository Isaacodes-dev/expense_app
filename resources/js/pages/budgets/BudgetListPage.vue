<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budgets';
import { formatCurrency } from '@/utils/formatters';
import MonthYearPicker from '@/components/common/MonthYearPicker.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useNotificationStore } from '@/composables/useNotification';

const router = useRouter();
const budgetStore = useBudgetStore();
const notify = useNotificationStore();

const now = new Date();
const month = ref(now.getMonth() + 1);
const year = ref(now.getFullYear());
const deleteTarget = ref<number | null>(null);
const deleting = ref(false);

function loadData() { budgetStore.fetchAll(month.value, year.value); }

onMounted(loadData);
watch([month, year], loadData);

async function handleDelete() {
    if (deleteTarget.value === null) { return; }
    deleting.value = true;
    try {
        await budgetStore.remove(deleteTarget.value);
        deleteTarget.value = null;
        notify.success('Deleted', 'Budget has been removed.');
    } catch {
        deleteTarget.value = null;
        notify.error('Error', 'Failed to delete budget.');
    } finally { deleting.value = false; }
}

function barColor(pct: number): string {
    if (pct > 100) { return 'bg-red-500'; }
    if (pct > 75) { return 'bg-yellow-500'; }
    return 'bg-green-500';
}
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">Budgets</h1>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <MonthYearPicker v-model:month="month" v-model:year="year" />
                <button @click="router.push('/budgets/create')"
                    class="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto">
                    Add Budget
                </button>
            </div>
        </div>

        <div v-if="budgetStore.loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>

        <EmptyState v-else-if="budgetStore.items.length === 0"
            title="No budgets for this month"
            description="Create budgets to track spending by category."
            action-label="Add Budget"
            @action="router.push('/budgets/create')" />

        <div v-else class="space-y-3">
            <div v-for="budget in budgetStore.items" :key="budget.id"
                class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
                <div class="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span class="font-medium text-gray-900">{{ budget.category?.name }}</span>
                        <span v-if="budget.over_budget" class="ml-2 text-xs font-medium text-red-600">Over budget</span>
                    </div>
                    <div class="flex items-center justify-between gap-3 text-sm sm:justify-end">
                        <span class="text-gray-500">
                            {{ formatCurrency(parseFloat(budget.actual)) }} / {{ formatCurrency(parseFloat(budget.amount)) }}
                        </span>
                        <div class="flex gap-3">
                            <button @click="router.push(`/budgets/${budget.id}/edit`)" class="text-xs font-medium text-gray-600 hover:text-gray-900">Edit</button>
                            <button @click="deleteTarget = budget.id" class="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                        </div>
                    </div>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div :class="['h-full rounded-full transition-all duration-500', barColor(budget.percentage)]"
                        :style="{ width: Math.min(budget.percentage, 100) + '%' }"></div>
                </div>
                <div class="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{{ budget.percentage }}% used</span>
                    <span>{{ formatCurrency(parseFloat(budget.remaining)) }} remaining</span>
                </div>
            </div>
        </div>

        <ConfirmDialog :open="deleteTarget !== null" title="Delete Budget"
            message="Are you sure you want to delete this budget?"
            confirm-text="Delete" :loading="deleting"
            @confirm="handleDelete" @cancel="deleteTarget = null" />
    </div>
</template>
