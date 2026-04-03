<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';
import type { Component } from 'vue';

defineProps<{
    title: string;
    description?: string;
    actionLabel?: string;
    icon?: Component;
}>();

const emit = defineEmits<{
    action: [];
}>();
</script>

<template>
    <div class="flex flex-col items-center justify-center py-16 text-center">
        <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100"
        >
            <component
                :is="icon || Inbox"
                class="h-7 w-7 text-gray-400"
                :stroke-width="1.5"
            />
        </div>
        <h3 class="mt-4 text-sm font-semibold text-gray-900">{{ title }}</h3>
        <p v-if="description" class="mt-1.5 max-w-sm text-sm text-gray-500">
            {{ description }}
        </p>
        <button
            v-if="actionLabel"
            @click="emit('action')"
            class="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
        >
            {{ actionLabel }}
        </button>
    </div>
</template>
