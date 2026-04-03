<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue';
import type { Budget, BudgetPayload } from '@/types/budget';
import { useCategoryStore } from '@/stores/categories';
import { MONTHS } from '@/utils/constants';

const categoryStore = useCategoryStore();

const props = defineProps<{
    budget?: Budget | null;
    loading?: boolean;
    errors?: Record<string, string[]>;
}>();

const emit = defineEmits<{ submit: [data: BudgetPayload] }>();

const now = new Date();
const form = reactive<BudgetPayload>({
    category_id: 0,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    amount: 0,
});

onMounted(() => {
    if (categoryStore.items.length === 0) { categoryStore.fetchAll(true); }
});

watch(() => props.budget, (b) => {
    if (b) {
        form.category_id = b.category_id;
        form.month = b.month;
        form.year = b.year;
        form.amount = parseFloat(b.amount);
    }
}, { immediate: true });

function handleSubmit() { emit('submit', { ...form }); }
</script>

<template>
    <form @submit.prevent="handleSubmit" class="max-w-lg space-y-4">
        <div>
            <label for="category_id" class="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select id="category_id" v-model="form.category_id" required :disabled="!!budget"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100">
                <option :value="0" disabled>Select a category</option>
                <option v-for="cat in categoryStore.items" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <p v-if="errors?.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id[0] }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="month" class="mb-1 block text-sm font-medium text-gray-700">Month</label>
                <select id="month" v-model="form.month" :disabled="!!budget"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100">
                    <option v-for="(m, i) in MONTHS" :key="i" :value="i + 1">{{ m }}</option>
                </select>
            </div>
            <div>
                <label for="year" class="mb-1 block text-sm font-medium text-gray-700">Year</label>
                <input id="year" v-model.number="form.year" type="number" min="2020" max="2100" :disabled="!!budget"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none disabled:bg-gray-100" />
            </div>
        </div>

        <div>
            <label for="amount" class="mb-1 block text-sm font-medium text-gray-700">Budget Amount</label>
            <input id="amount" v-model.number="form.amount" type="number" step="0.01" min="0.01" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
            <p v-if="errors?.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
        </div>

        <div class="flex items-center gap-3 pt-4">
            <button type="submit" :disabled="loading"
                class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                {{ loading ? 'Saving...' : (budget ? 'Update Budget' : 'Create Budget') }}
            </button>
            <router-link to="/budgets" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</router-link>
        </div>
    </form>
</template>
