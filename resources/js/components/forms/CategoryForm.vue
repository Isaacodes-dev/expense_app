<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Category, CategoryPayload } from '@/types/category';

const props = defineProps<{
    category?: Category | null;
    loading?: boolean;
    errors?: Record<string, string[]>;
}>();

const emit = defineEmits<{
    submit: [data: CategoryPayload];
}>();

const form = reactive<CategoryPayload>({
    name: '',
    description: '',
    is_active: true,
});

watch(
    () => props.category,
    (cat) => {
        if (cat) {
            form.name = cat.name;
            form.description = cat.description || '';
            form.is_active = cat.is_active;
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
            <label
                for="name"
                class="mb-1 block text-sm font-medium text-gray-700"
            >
                Name
            </label>
            <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
                {{ errors.name[0] }}
            </p>
        </div>

        <div>
            <label
                for="description"
                class="mb-1 block text-sm font-medium text-gray-700"
            >
                Description
            </label>
            <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
            ></textarea>
            <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
                {{ errors.description[0] }}
            </p>
        </div>

        <div class="flex items-center gap-2">
            <input
                id="is_active"
                v-model="form.is_active"
                type="checkbox"
                class="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <label for="is_active" class="text-sm text-gray-700">Active</label>
        </div>

        <div class="flex items-center gap-3 pt-4">
            <button
                type="submit"
                :disabled="loading"
                class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
                {{ loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category') }}
            </button>
            <router-link
                to="/categories"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </router-link>
        </div>
    </form>
</template>
