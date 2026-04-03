<script setup lang="ts">
import { reactive } from 'vue';
import type { SavingsContributionPayload } from '@/types/savings';

defineProps<{
    loading?: boolean;
    errors?: Record<string, string[]>;
}>();

const emit = defineEmits<{ submit: [data: SavingsContributionPayload] }>();

const form = reactive<SavingsContributionPayload>({
    amount: 0,
    contribution_date: new Date().toISOString().split('T')[0],
    note: '',
});

function resetForm() {
    form.amount = 0;
    form.note = '';
    form.contribution_date = new Date().toISOString().split('T')[0];
}

function handleSubmit() {
    emit('submit', { ...form });
}

defineExpose({ resetForm });
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-wrap items-end gap-3">
        <div>
            <label for="contribution_date" class="mb-1 block text-xs text-gray-500">Date</label>
            <input id="contribution_date" v-model="form.contribution_date" type="date" required
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
        </div>
        <div>
            <label for="contribution_amount" class="mb-1 block text-xs text-gray-500">Amount</label>
            <input id="contribution_amount" v-model.number="form.amount" type="number" step="0.01" min="0.01" required
                class="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
        </div>
        <div class="flex-1">
            <label for="contribution_note" class="mb-1 block text-xs text-gray-500">Note (optional)</label>
            <input id="contribution_note" v-model="form.note" type="text" placeholder="Optional note"
                class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none" />
        </div>
        <button type="submit" :disabled="loading"
            class="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {{ loading ? 'Adding...' : 'Add' }}
        </button>
    </form>
</template>
