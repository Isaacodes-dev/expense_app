<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

const props = defineProps<{
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    confirmClass?: string;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>();

function onConfirm() {
    emit('confirm');
}

function onCancel() {
    emit('cancel');
}
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="props.open"
                class="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div
                    class="fixed inset-0 z-0 bg-black/40 backdrop-blur-[2px]"
                    @click="onCancel"
                ></div>
                <div
                    class="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xl"
                >
                    <div class="flex items-start gap-4">
                        <div
                            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50"
                        >
                            <AlertTriangle
                                class="h-5 w-5 text-red-500"
                                :stroke-width="2"
                            />
                        </div>
                        <div>
                            <h3 class="text-[15px] font-semibold text-gray-900">
                                {{ title || 'Confirm' }}
                            </h3>
                            <p class="mt-1 text-sm text-gray-500">
                                {{ message || 'Are you sure you want to proceed?' }}
                            </p>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-2.5">
                        <button
                            @click="onCancel"
                            class="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            @click="onConfirm"
                            :disabled="props.loading"
                            :class="[
                                'rounded-lg px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-50',
                                confirmClass || 'bg-red-600 hover:bg-red-500',
                            ]"
                        >
                            {{ props.loading ? 'Deleting...' : (confirmText || 'Confirm') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
