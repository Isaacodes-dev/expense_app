<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { savingsGoalService } from '@/services/savingsGoalService';
import { savingsContributionService } from '@/services/savingsContributionService';
import ContributionForm from '@/components/forms/ContributionForm.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { SavingsGoal, SavingsContributionPayload } from '@/types/savings';
import type { AxiosError } from 'axios';
import { useNotificationStore } from '@/composables/useNotification';

const route = useRoute();
const router = useRouter();
const notify = useNotificationStore();

const goalId = computed(() => Number(route.params.id));
const goal = ref<SavingsGoal | null>(null);
const loading = ref(true);
const addingContribution = ref(false);
const contributionErrors = ref<Record<string, string[]>>({});
const deleteTarget = ref<number | null>(null);
const deleting = ref(false);
const contributionFormRef = ref<InstanceType<typeof ContributionForm> | null>(null);

async function loadGoal() {
    loading.value = true;
    try {
        const response = await savingsGoalService.get(goalId.value);
        goal.value = response.data;
    } finally {
        loading.value = false;
    }
}

onMounted(loadGoal);

async function addContribution(data: SavingsContributionPayload) {
    addingContribution.value = true;
    contributionErrors.value = {};
    try {
        await savingsContributionService.create(goalId.value, data);
        await loadGoal();
        contributionFormRef.value?.resetForm();
        notify.success('Contribution Added', 'Your contribution has been recorded.');
    } catch (err) {
        const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
        if (error.response?.status === 422 && error.response.data.errors) {
            contributionErrors.value = error.response.data.errors;
        } else {
            notify.error('Error', 'Failed to add contribution.');
        }
    } finally {
        addingContribution.value = false;
    }
}

async function deleteContribution() {
    if (deleteTarget.value === null) { return; }
    deleting.value = true;
    try {
        await savingsContributionService.delete(goalId.value, deleteTarget.value);
        deleteTarget.value = null;
        await loadGoal();
    } finally { deleting.value = false; }
}
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button @click="router.push('/savings')"
                class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto">
                Back
            </button>
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">Savings Goal</h1>
        </div>

        <div v-if="loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>

        <div v-else-if="goal">
            <div class="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 sm:p-6">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900 sm:text-xl">{{ goal.name }}</h2>
                        <p v-if="goal.description" class="mt-1 text-sm text-gray-500">{{ goal.description }}</p>
                    </div>
                    <router-link :to="`/savings/${goal.id}/edit`"
                        class="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto">
                        Edit
                    </router-link>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                    <div>
                        <span class="text-gray-500">Target</span>
                        <p class="font-medium text-gray-900">{{ formatCurrency(parseFloat(goal.target_amount)) }}</p>
                    </div>
                    <div>
                        <span class="text-gray-500">Saved</span>
                        <p class="font-medium text-green-600">{{ formatCurrency(parseFloat(goal.saved_amount)) }}</p>
                    </div>
                    <div>
                        <span class="text-gray-500">Deadline</span>
                        <p class="font-medium text-gray-900">{{ goal.deadline ? formatDate(goal.deadline) : 'None' }}</p>
                    </div>
                </div>

                <div class="mt-4">
                    <div class="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div class="h-full rounded-full bg-blue-500 transition-all"
                            :style="{ width: Math.min(goal.progress_percentage, 100) + '%' }"></div>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">{{ goal.progress_percentage }}% complete</p>
                </div>
            </div>

            <div class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-950/5 sm:p-6">
                <h3 class="mb-4 text-lg font-medium text-gray-900">Contributions</h3>

                <div class="mb-4 rounded-lg bg-gray-50 p-3 sm:p-4">
                    <ContributionForm ref="contributionFormRef" :loading="addingContribution" :errors="contributionErrors" @submit="addContribution" />
                </div>

                <div v-if="!goal.contributions || goal.contributions.length === 0"
                    class="py-8 text-center text-sm text-gray-500">
                    No contributions yet. Add one above.
                </div>

                <!-- Desktop table -->
                <table v-else class="hidden min-w-full divide-y divide-gray-200 md:table">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                            <th class="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                            <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Note</th>
                            <th class="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="c in goal.contributions" :key="c.id">
                            <td class="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{{ formatDate(c.contribution_date) }}</td>
                            <td class="whitespace-nowrap px-4 py-2 text-right text-sm font-medium text-green-600">
                                {{ formatCurrency(parseFloat(c.amount)) }}
                            </td>
                            <td class="px-4 py-2 text-sm text-gray-500">{{ c.note || '\u2014' }}</td>
                            <td class="whitespace-nowrap px-4 py-2 text-right">
                                <button @click="deleteTarget = c.id" class="text-sm text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Mobile cards -->
                <div v-if="goal.contributions && goal.contributions.length > 0" class="space-y-3 md:hidden">
                    <div v-for="c in goal.contributions" :key="'m-' + c.id"
                        class="rounded-lg border border-gray-200/80 bg-white p-3">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-sm font-medium text-green-600">{{ formatCurrency(parseFloat(c.amount)) }}</p>
                                <p class="mt-0.5 text-xs text-gray-500">{{ formatDate(c.contribution_date) }}</p>
                                <p v-if="c.note" class="mt-1 text-xs text-gray-400">{{ c.note }}</p>
                            </div>
                            <button @click="deleteTarget = c.id" class="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmDialog :open="deleteTarget !== null" title="Delete Contribution"
            message="Are you sure you want to delete this contribution?"
            confirm-text="Delete" :loading="deleting"
            @confirm="deleteContribution" @cancel="deleteTarget = null" />
    </div>
</template>
