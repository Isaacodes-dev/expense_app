<script setup lang="ts">
import { computed, onErrorCaptured, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import ToastContainer from '@/components/common/ToastContainer.vue';

const route = useRoute();
const hasError = ref(false);

const LayoutComponent = computed(() => {
    return route.meta.layout === 'auth' ? AuthLayout : AppLayout;
});

onErrorCaptured((err) => {
    console.error('Unhandled component error:', err);
    hasError.value = true;

    return false;
});

function reload() {
    hasError.value = false;
    window.location.reload();
}
</script>

<template>
    <template v-if="hasError">
        <div class="flex min-h-screen items-center justify-center bg-gray-50">
            <div class="text-center">
                <h1 class="text-lg font-semibold text-gray-900">Something went wrong</h1>
                <p class="mt-1 text-sm text-gray-500">An unexpected error occurred.</p>
                <button
                    @click="reload"
                    class="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Reload page
                </button>
            </div>
        </div>
    </template>
    <template v-else>
        <component :is="LayoutComponent">
            <router-view />
        </component>
        <ToastContainer />
    </template>
</template>
