<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categories';
import { categoryService } from '@/services/categoryService';
import CategoryForm from '@/components/forms/CategoryForm.vue';
import type { Category, CategoryPayload } from '@/types/category';
import type { AxiosError } from 'axios';
import { useNotificationStore } from '@/composables/useNotification';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const notify = useNotificationStore();

const categoryId = computed(() =>
    route.params.id ? Number(route.params.id) : null
);
const isEditing = computed(() => categoryId.value !== null);

const category = ref<Category | null>(null);
const loading = ref(false);
const saving = ref(false);
const errors = ref<Record<string, string[]>>({});

onMounted(async () => {
    if (isEditing.value) {
        loading.value = true;

        try {
            const response = await categoryService.get(categoryId.value!);
            category.value = response.data;
        } finally {
            loading.value = false;
        }
    }
});

async function handleSubmit(data: CategoryPayload) {
    saving.value = true;
    errors.value = {};

    try {
        if (isEditing.value) {
            await categoryStore.update(categoryId.value!, data);
            notify.success('Category Updated', 'Category changes have been saved.');
        } else {
            await categoryStore.create(data);
            notify.success('Category Created', 'Your new category has been added.');
        }

        router.push('/categories');
    } catch (err) {
        const error = err as AxiosError<{
            errors?: Record<string, string[]>;
        }>;

        if (error.response?.status === 422 && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            notify.error('Error', 'Failed to save category. Please try again.');
        }
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <div>
        <h1 class="mb-6 text-2xl font-semibold text-gray-900">
            {{ isEditing ? 'Edit Category' : 'Create Category' }}
        </h1>

        <div v-if="loading" class="py-12 text-center text-sm text-gray-500">
            Loading...
        </div>

        <CategoryForm
            v-else
            :category="category"
            :loading="saving"
            :errors="errors"
            @submit="handleSubmit"
        />
    </div>
</template>
