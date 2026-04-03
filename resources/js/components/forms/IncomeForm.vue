<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Income, IncomePayload } from '@/types/income';

const props = defineProps<{
    income?: Income | null;
    loading?: boolean;
    errors?: Record<string, string[]>;
}>();

const emit = defineEmits<{
    submit: [data: IncomePayload];
}>();

const form = reactive<IncomePayload>({
    date: new Date().toISOString().split('T')[0],
    source: '',
    amount: 0,
    notes: '',
});

watch(
    () => props.income,
    (inc) => {
        if (inc) {
            form.date = inc.date;
            form.source = inc.source;
            form.amount = parseFloat(inc.amount);
            form.notes = inc.notes || '';
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
            <label for="date" class="mb-1 block text-sm font-medium text-gray-700">Date</label>
            <input id="date" v-model="form.date" type="date" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.date" class="mt-1 text-sm text-red-600">{{ errors.date[0] }}</p>
        </div>

        <div>
            <label for="source" class="mb-1 block text-sm font-medium text-gray-700">Source</label>
            <input id="source" v-model="form.source" type="text" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.source" class="mt-1 text-sm text-red-600">{{ errors.source[0] }}</p>
        </div>

        <div>
            <label for="amount" class="mb-1 block text-sm font-medium text-gray-700">Amount</label>
            <input id="amount" v-model.number="form.amount" type="number" step="0.01" min="0.01" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
        </div>

        <div>
            <label for="notes" class="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea id="notes" v-model="form.notes" rows="3"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"></textarea>
            <p v-if="errors?.notes" class="mt-1 text-sm text-red-600">{{ errors.notes[0] }}</p>
        </div>

        <div class="flex items-center gap-3 pt-4">
            <button type="submit" :disabled="loading"
                class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                {{ loading ? 'Saving...' : (income ? 'Update Income' : 'Add Income') }}
            </button>
            <router-link to="/incomes"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
            </router-link>
        </div>
    </form>
</template>
