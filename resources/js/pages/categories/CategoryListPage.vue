<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categories';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useNotificationStore } from '@/composables/useNotification';
import { getErrorMessage } from '@/utils/api-error';

const router = useRouter();
const categoryStore = useCategoryStore();
const notify = useNotificationStore();

const deleteTarget = ref<number | null>(null);
const deleting = ref(false);

onMounted(() => {
    categoryStore.fetchAll();
});

async function handleDelete() {
    if (deleteTarget.value === null) {
        return;
    }

    deleting.value = true;

    try {
        await categoryStore.remove(deleteTarget.value);
        deleteTarget.value = null;
        notify.success('Deleted', 'Category has been removed.');
    } catch (err: unknown) {
        deleteTarget.value = null;
        notify.error('Error', getErrorMessage(err, 'Failed to delete category.'));
    } finally {
        deleting.value = false;
    }
}
</script>

<template>
    <div>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl">Categories</h1>
            <button @click="router.push('/categories/create')"
                class="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto">
                Add Category
            </button>
        </div>

        <div v-if="categoryStore.loading" class="py-12 text-center text-sm text-gray-500">Loading...</div>

        <EmptyState v-else-if="categoryStore.items.length === 0"
            title="No categories yet"
            description="Create your first category to start organizing your finances."
            action-label="Add Category"
            @action="router.push('/categories/create')" />

        <div v-else>
            <!-- Desktop table -->
            <div class="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 md:block">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="category in categoryStore.items" :key="category.id" class="hover:bg-gray-50">
                            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{{ category.name }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ category.description || '—' }}</td>
                            <td class="whitespace-nowrap px-6 py-4">
                                <span :class="[
                                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                    category.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600',
                                ]">
                                    {{ category.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <button @click="router.push(`/categories/${category.id}/edit`)"
                                    class="font-medium text-gray-600 hover:text-gray-900">Edit</button>
                                <button @click="deleteTarget = category.id"
                                    class="ml-4 font-medium text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Mobile cards -->
            <div class="space-y-3 md:hidden">
                <div v-for="category in categoryStore.items" :key="'m-' + category.id"
                    class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-900">{{ category.name }}</p>
                            <p v-if="category.description" class="mt-0.5 text-xs text-gray-500">{{ category.description }}</p>
                        </div>
                        <span :class="[
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                            category.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600',
                        ]">
                            {{ category.is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                    <div class="mt-3 flex justify-end gap-3 border-t border-gray-100 pt-3">
                        <button @click="router.push(`/categories/${category.id}/edit`)"
                            class="text-xs font-medium text-gray-600 hover:text-gray-900">Edit</button>
                        <button @click="deleteTarget = category.id"
                            class="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmDialog :open="deleteTarget !== null" title="Delete Category"
            message="Are you sure you want to delete this category? This action cannot be undone."
            confirm-text="Delete" :loading="deleting"
            @confirm="handleDelete" @cancel="deleteTarget = null" />
    </div>
</template>
