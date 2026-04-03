<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useIncomeStore } from '@/stores/incomes';
import { formatCurrency, formatDate } from '@/utils/formatters';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useNotificationStore } from '@/composables/useNotification';

const router = useRouter();
const incomeStore = useIncomeStore();
const notify = useNotificationStore();

const page = ref(1);
const dateFrom = ref('');
const dateTo = ref('');
const deleteTarget = ref<number | null>(null);
const deleting = ref(false);

function loadData() {
    incomeStore.fetchAll({
        page: page.value,
        date_from: dateFrom.value || undefined,
        date_to: dateTo.value || undefined,
    });
}

onMounted(loadData);

watch([page, dateFrom, dateTo], loadData);

async function handleDelete() {
    if (deleteTarget.value === null) { return; }
    deleting.value = true;
    try {
        await incomeStore.remove(deleteTarget.value);
        deleteTarget.value = null;
        notify.success('Deleted', 'Income record has been removed.');
    } catch {
        deleteTarget.value = null;
        notify.error('Error', 'Failed to delete income record.');
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">Income</h1>
            <button @click="router.push('/incomes/create')"
                class="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto">
                Add Income
            </button>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-3 sm:flex sm:items-end sm:gap-4">
            <div>
                <label class="mb-1 block text-xs text-gray-500">From</label>
                <input v-model="dateFrom" type="date"
                    class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            </div>
            <div>
                <label class="mb-1 block text-xs text-gray-500">To</label>
                <input v-model="dateTo" type="date"
                    class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            </div>
        </div>

        <div v-if="incomeStore.loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>

        <EmptyState v-else-if="incomeStore.items.length === 0"
            title="No income records yet"
            description="Add your first income record to start tracking."
            action-label="Add Income"
            @action="router.push('/incomes/create')" />

        <div v-else>
            <!-- Desktop table -->
            <div class="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 md:block">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Source</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="income in incomeStore.items" :key="income.id" class="hover:bg-gray-50">
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ formatDate(income.date) }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ income.source }}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-emerald-600">
                                {{ formatCurrency(parseFloat(income.amount)) }}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <button @click="router.push(`/incomes/${income.id}/edit`)"
                                    class="font-medium text-gray-600 hover:text-gray-900">Edit</button>
                                <button @click="deleteTarget = income.id"
                                    class="ml-4 font-medium text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile cards -->
            <div class="space-y-3 md:hidden">
                <div v-for="income in incomeStore.items" :key="'m-' + income.id"
                    class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-900">{{ income.source }}</p>
                            <p class="mt-0.5 text-xs text-gray-500">{{ formatDate(income.date) }}</p>
                        </div>
                        <p class="text-sm font-semibold text-emerald-600">
                            {{ formatCurrency(parseFloat(income.amount)) }}
                        </p>
                    </div>
                    <div class="mt-3 flex justify-end gap-3 border-t border-gray-100 pt-3">
                        <button @click="router.push(`/incomes/${income.id}/edit`)"
                            class="text-xs font-medium text-gray-600 hover:text-gray-900">Edit</button>
                        <button @click="deleteTarget = income.id"
                            class="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="incomeStore.meta && incomeStore.meta.last_page > 1"
                class="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <span class="text-sm text-gray-500">
                    Page {{ incomeStore.meta.current_page }} of {{ incomeStore.meta.last_page }}
                    ({{ incomeStore.meta.total }} records)
                </span>
                <div class="flex gap-2">
                    <button @click="page--" :disabled="page <= 1"
                        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button @click="page++" :disabled="page >= (incomeStore.meta?.last_page ?? 1)"
                        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>

        <ConfirmDialog :open="deleteTarget !== null" title="Delete Income"
            message="Are you sure you want to delete this income record?"
            confirm-text="Delete" :loading="deleting"
            @confirm="handleDelete" @cancel="deleteTarget = null" />
    </div>
</template>
