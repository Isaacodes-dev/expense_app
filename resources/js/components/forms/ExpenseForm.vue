<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue';
import type { Expense, ExpensePayload } from '@/types/expense';
import { useCategoryStore } from '@/stores/categories';

const categoryStore = useCategoryStore();

const props = defineProps<{
    expense?: Expense | null;
    loading?: boolean;
    errors?: Record<string, string[]>;
}>();

const emit = defineEmits<{
    submit: [data: ExpensePayload];
}>();

const form = reactive<ExpensePayload>({
    category_id: 0,
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: '',
    payment_method: 'cash',
    notes: '',
});

const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'other', label: 'Other' },
];

onMounted(async () => {
    if (categoryStore.items.length === 0) {
        await categoryStore.fetchAll(true);
    }
});

watch(
    () => props.expense,
    (exp) => {
        if (exp) {
            form.category_id = exp.category_id;
            form.date = exp.date;
            form.amount = parseFloat(exp.amount);
            form.description = exp.description;
            form.payment_method = exp.payment_method || 'cash';
            form.notes = exp.notes || '';
        }
    },
    { immediate: true }
);

function handleSubmit() {
    emit('submit', { ...form });
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="max-w-lg space-y-4">
        <div>
            <label for="category_id" class="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select id="category_id" v-model="form.category_id" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none">
                <option :value="0" disabled>Select a category</option>
                <option v-for="cat in categoryStore.items" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                </option>
            </select>
            <p v-if="errors?.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id[0] }}</p>
        </div>

        <div>
            <label for="date" class="mb-1 block text-sm font-medium text-gray-700">Date</label>
            <input id="date" v-model="form.date" type="date" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.date" class="mt-1 text-sm text-red-600">{{ errors.date[0] }}</p>
        </div>

        <div>
            <label for="amount" class="mb-1 block text-sm font-medium text-gray-700">Amount</label>
            <input id="amount" v-model.number="form.amount" type="number" step="0.01" min="0.01" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
        </div>

        <div>
            <label for="description" class="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <input id="description" v-model="form.description" type="text" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
        </div>

        <div>
            <label for="payment_method" class="mb-1 block text-sm font-medium text-gray-700">Payment Method</label>
            <select id="payment_method" v-model="form.payment_method"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none">
                <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
                    {{ method.label }}
                </option>
            </select>
        </div>

        <div>
            <label for="notes" class="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea id="notes" v-model="form.notes" rows="3"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"></textarea>
        </div>

        <div class="flex items-center gap-3 pt-4">
            <button type="submit" :disabled="loading"
                class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                {{ loading ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense') }}
            </button>
            <router-link to="/expenses"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
            </router-link>
        </div>
    </form>
</template>
