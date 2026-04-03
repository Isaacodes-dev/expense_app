<script setup lang="ts">
import { useNotificationStore } from '@/composables/useNotification';
import type { NotificationType } from '@/composables/useNotification';
import { CheckCircle2, XCircle, Info, X } from 'lucide-vue-next';
import type { Component } from 'vue';

const notifications = useNotificationStore();

const config: Record<
    NotificationType,
    { icon: Component; iconClass: string; barClass: string; borderClass: string }
> = {
    success: {
        icon: CheckCircle2,
        iconClass: 'text-emerald-500',
        barClass: 'bg-emerald-500',
        borderClass: 'border-emerald-100',
    },
    error: {
        icon: XCircle,
        iconClass: 'text-red-500',
        barClass: 'bg-red-500',
        borderClass: 'border-red-100',
    },
    info: {
        icon: Info,
        iconClass: 'text-blue-500',
        barClass: 'bg-blue-500',
        borderClass: 'border-blue-100',
    },
};
</script>

<template>
    <Teleport to="body">
        <div
            class="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-end gap-2 p-4 sm:p-6"
        >
            <TransitionGroup
                enter-active-class="duration-300 ease-out"
                enter-from-class="translate-x-full opacity-0"
                enter-to-class="translate-x-0 opacity-100"
                leave-active-class="duration-200 ease-in"
                leave-from-class="translate-x-0 opacity-100"
                leave-to-class="translate-x-full opacity-0"
                move-class="duration-300 ease-out"
            >
                <div
                    v-for="toast in notifications.items"
                    :key="toast.id"
                    :class="[
                        'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border bg-white shadow-lg',
                        config[toast.type].borderClass,
                    ]"
                >
                    <div class="flex items-start gap-3 p-4">
                        <component
                            :is="config[toast.type].icon"
                            :class="[
                                'mt-0.5 h-5 w-5 flex-shrink-0',
                                config[toast.type].iconClass,
                            ]"
                            :stroke-width="2"
                        />
                        <div class="min-w-0 flex-1">
                            <p class="text-sm font-semibold text-gray-900">
                                {{ toast.title }}
                            </p>
                            <p
                                v-if="toast.message"
                                class="mt-0.5 text-sm text-gray-500"
                            >
                                {{ toast.message }}
                            </p>
                        </div>
                        <button
                            @click="notifications.remove(toast.id)"
                            class="flex-shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X class="h-4 w-4" />
                        </button>
                    </div>
                    <!-- Animated progress bar -->
                    <div class="h-1 w-full bg-gray-100">
                        <div
                            :class="[
                                'h-full rounded-r-full',
                                config[toast.type].barClass,
                            ]"
                            :style="{
                                animation: `shrink ${toast.duration || 4000}ms linear forwards`,
                            }"
                        ></div>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
@keyframes shrink {
    from {
        width: 100%;
    }
    to {
        width: 0%;
    }
}
</style>
