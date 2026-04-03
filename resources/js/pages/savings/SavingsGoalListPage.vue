<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSavingsGoalStore } from '@/stores/savingsGoals';
import { formatCurrency, formatDate } from '@/utils/formatters';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useNotificationStore } from '@/composables/useNotification';

const router = useRouter();
const goalStore = useSavingsGoalStore();
const notify = useNotificationStore();

const deleteTarget = ref<number | null>(null);
const deleting = ref(false);

onMounted(() => { goalStore.fetchAll(); });

async function handleDelete() {
    if (deleteTarget.value === null) { return; }
    deleting.value = true;
    try {
        await goalStore.remove(deleteTarget.value);
        deleteTarget.value = null;
        notify.success('Deleted', 'Savings goal has been removed.');
    } catch {
        deleteTarget.value = null;
        notify.error('Error', 'Failed to delete savings goal.');
    } finally { deleting.value = false; }
}

function statusColor(status: string): string {
    if (status === 'completed') { return 'bg-green-50 text-green-700'; }
    if (status === 'cancelled') { return 'bg-gray-100 text-gray-600'; }
    return 'bg-blue-50 text-blue-700';
}
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">Savings Goals</h1>
            <button @click="router.push('/savings/create')"
                class="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto">
                Add Goal
            </button>
        </div>

        <div v-if="goalStore.loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>

        <EmptyState v-else-if="goalStore.items.length === 0"
            title="No savings goals yet"
            description="Create a savings goal to start saving towards something."
            action-label="Add Goal"
            @action="router.push('/savings/create')" />

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="goal in goalStore.items" :key="goal.id"
                class="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm">
                <div class="mb-3 flex items-start justify-between">
                    <div class="min-w-0 flex-1">
                        <h3 class="truncate font-medium text-gray-900">{{ goal.name }}</h3>
                        <span :class="['mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium', statusColor(goal.status)]">
                            {{ goal.status }}
                        </span>
                    </div>
                </div>
                <div class="mb-2 text-sm text-gray-500">
                    {{ formatCurrency(parseFloat(goal.saved_amount)) }} of {{ formatCurrency(parseFloat(goal.target_amount)) }}
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div class="h-full rounded-full bg-blue-500 transition-all duration-500"
                        :style="{ width: Math.min(goal.progress_percentage, 100) + '%' }"></div>
                </div>
                <div class="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{{ goal.progress_percentage }}%</span>
                    <span v-if="goal.deadline">Due {{ formatDate(goal.deadline) }}</span>
                </div>
                <div class="mt-3 flex gap-3 border-t border-gray-100 pt-3">
                    <button @click="router.push(`/savings/${goal.id}`)" class="text-xs font-medium text-gray-600 hover:text-gray-900">View</button>
                    <button @click="router.push(`/savings/${goal.id}/edit`)" class="text-xs font-medium text-gray-600 hover:text-gray-900">Edit</button>
                    <button @click="deleteTarget = goal.id" class="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                </div>
            </div>
        </div>

        <ConfirmDialog :open="deleteTarget !== null" title="Delete Savings Goal"
            message="This will also delete all contributions. Are you sure?"
            confirm-text="Delete" :loading="deleting"
            @confirm="handleDelete" @cancel="deleteTarget = null" />
    </div>
</template>
