<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import MonthYearPicker from '@/components/common/MonthYearPicker.vue';
import SummaryCards from '@/components/dashboard/SummaryCards.vue';
import BudgetOverview from '@/components/dashboard/BudgetOverview.vue';
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue';
import ExpensesByCategory from '@/components/dashboard/ExpensesByCategory.vue';
import SavingsProgress from '@/components/dashboard/SavingsProgress.vue';

const dashboardStore = useDashboardStore();

const now = new Date();
const month = ref(now.getMonth() + 1);
const year = ref(now.getFullYear());

function loadData() {
    dashboardStore.fetch(month.value, year.value);
}

onMounted(loadData);
watch([month, year], loadData);
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">Dashboard</h1>
            <MonthYearPicker v-model:month="month" v-model:year="year" />
        </div>

        <div v-if="dashboardStore.loading" class="py-12 text-center text-sm text-gray-500">
            Loading...
        </div>

        <div v-else-if="dashboardStore.data" class="space-y-6">
            <SummaryCards
                :income="dashboardStore.data.totals.income"
                :expenses="dashboardStore.data.totals.expenses"
                :savings="dashboardStore.data.totals.savings"
                :carried-forward="dashboardStore.data.totals.carried_forward"
                :balance="dashboardStore.data.totals.balance"
            />

            <div class="grid gap-6 lg:grid-cols-2">
                <BudgetOverview :items="dashboardStore.data.budget_summary" />
                <ExpensesByCategory :items="dashboardStore.data.expenses_by_category" />
            </div>

            <div class="grid gap-6 lg:grid-cols-2">
                <RecentTransactions :items="dashboardStore.data.recent_transactions" />
                <SavingsProgress :items="dashboardStore.data.savings_overview" />
            </div>
        </div>

        <div v-else class="py-12 text-center text-sm text-gray-500">
            No data available. Start by adding some income and expenses.
        </div>
    </div>
</template>
