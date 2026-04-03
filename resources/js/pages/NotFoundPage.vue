<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="flex min-h-screen items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-300">404</h1>
            <p class="mt-4 text-lg text-gray-600">Page not found</p>
            <button
                class="mt-6 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                @click="router.push('/dashboard')"
            >
                Go to Dashboard
            </button>
        </div>
    </div>
</template>
