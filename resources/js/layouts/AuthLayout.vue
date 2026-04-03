<script setup lang="ts">
import { Wallet } from 'lucide-vue-next';
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div class="w-full max-w-md">
            <div class="mb-8 flex flex-col items-center text-center">
                <div
                    class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900"
                >
                    <Wallet class="h-6 w-6 text-white" />
                </div>
                <h1 class="text-xl font-semibold tracking-tight text-gray-900">
                    Finance App
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Personal expense & budgeting tracker
                </p>
            </div>
            <div
                class="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm"
            >
                <slot />
            </div>
        </div>
    </div>
</template>
