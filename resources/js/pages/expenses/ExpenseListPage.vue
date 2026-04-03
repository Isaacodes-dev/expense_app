<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useExpenseStore } from '@/stores/expenses';
import { useCategoryStore } from '@/stores/categories';
import { formatCurrency, formatDate } from '@/utils/formatters';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useNotificationStore } from '@/composables/useNotification';
import { getErrorMessage } from '@/utils/api-error';

const router = useRouter();
const expenseStore = useExpenseStore();
const notify = useNotificationStore();
const categoryStore = useCategoryStore();

const page = ref(1);
const dateFrom = ref('');
const dateTo = ref('');
const categoryId = ref<number | undefined>(undefined);
const deleteTarget = ref<number | null>(null);
const deleting = ref(false);
const deleteError = ref('');

function loadData() {
    expenseStore.fetchAll({
        page: page.value,
        date_from: dateFrom.value || undefined,
        date_to: dateTo.value || undefined,
        category_id: categoryId.value || undefined,
    });
}

onMounted(() => {
    loadData();

    if (categoryStore.items.length === 0) {
        categoryStore.fetchAll();
    }
});

watch([page, dateFrom, dateTo, categoryId], loadData);

async function handleDelete() {
    if (deleteTarget.value === null) {
        return;
    }

    deleting.value = true;
    deleteError.value = '';

    try {
        await expenseStore.remove(deleteTarget.value);
        deleteTarget.value = null;
        notify.success('Deleted', 'Expense has been removed.');
    } catch (err: unknown) {
        deleteError.value = getErrorMessage(err, 'Failed to delete expense.');
        deleteTarget.value = null;
        notify.error('Error', deleteError.value);
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">Expenses</h1>
            <button @click="router.push('/expenses/create')"
                class="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto">
                Add Expense
            </button>
        </div>

        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
            <div class="w-full sm:w-auto">
                <label class="mb-1 block text-xs text-gray-500">Category</label>
                <select v-model="categoryId"
                    class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none">
                    <option :value="undefined">All Categories</option>
                    <option v-for="cat in categoryStore.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
            </div>
            <div class="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
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
        </div>

        <div v-if="deleteError" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {{ deleteError }}
        </div>

        <div v-if="expenseStore.loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>

        <EmptyState v-else-if="expenseStore.items.length === 0"
            title="No expenses yet"
            description="Add your first expense to start tracking spending."
            action-label="Add Expense"
            @action="router.push('/expenses/create')" />

        <div v-else>
            <!-- Desktop table -->
            <div class="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 md:block">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Method</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="expense in expenseStore.items" :key="expense.id" class="hover:bg-gray-50">
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ formatDate(expense.date) }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ expense.description }}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ expense.category?.name ?? '—' }}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 capitalize">{{ expense.payment_method?.replace('_', ' ') ?? '—' }}</td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-red-600">
                                {{ formatCurrency(parseFloat(expense.amount)) }}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <button @click="router.push(`/expenses/${expense.id}/edit`)"
                                    class="font-medium text-gray-600 hover:text-gray-900">Edit</button>
                                <button @click="deleteTarget = expense.id"
                                    class="ml-4 font-medium text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile cards -->
            <div class="space-y-3 md:hidden">
                <div v-for="expense in expenseStore.items" :key="'m-' + expense.id"
                    class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div class="flex items-start justify-between">
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-medium text-gray-900">{{ expense.description }}</p>
                            <p class="mt-0.5 text-xs text-gray-500">
                                {{ formatDate(expense.date) }}
                                <span v-if="expense.category"> &middot; {{ expense.category.name }}</span>
                            </p>
                        </div>
                        <p class="ml-3 text-sm font-semibold text-red-600">
                            {{ formatCurrency(parseFloat(expense.amount)) }}
                        </p>
                    </div>
                    <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span class="text-xs capitalize text-gray-400">{{ expense.payment_method?.replace('_', ' ') ?? '—' }}</span>
                        <div class="flex gap-3">
                            <button @click="router.push(`/expenses/${expense.id}/edit`)"
                                class="text-xs font-medium text-gray-600 hover:text-gray-900">Edit</button>
                            <button @click="deleteTarget = expense.id"
                                class="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="expenseStore.meta && expenseStore.meta.last_page > 1"
                class="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <span class="text-sm text-gray-500">
                    Page {{ expenseStore.meta.current_page }} of {{ expenseStore.meta.last_page }}
                    ({{ expenseStore.meta.total }} records)
                </span>
                <div class="flex gap-2">
                    <button @click="page--" :disabled="page <= 1"
                        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button @click="page++" :disabled="page >= (expenseStore.meta?.last_page ?? 1)"
                        class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>

        <ConfirmDialog :open="deleteTarget !== null" title="Delete Expense"
            message="Are you sure you want to delete this expense?"
            confirm-text="Delete" :loading="deleting"
            @confirm="handleDelete" @cancel="deleteTarget = null" />
    </div>
</template>
