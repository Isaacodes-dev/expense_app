<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-vue-next';
import { MONTHS } from '@/utils/constants';

const props = defineProps<{
    month: number;
    year: number;
}>();

const emit = defineEmits<{
    'update:month': [value: number];
    'update:year': [value: number];
}>();

function prev() {
    if (props.month === 1) {
        emit('update:month', 12);
        emit('update:year', props.year - 1);
    } else {
        emit('update:month', props.month - 1);
    }
}

function next() {
    if (props.month === 12) {
        emit('update:month', 1);
        emit('update:year', props.year + 1);
    } else {
        emit('update:month', props.month + 1);
    }
}

const label = computed(() => `${MONTHS[props.month - 1]} ${props.year}`);
</script>

<template>
    <div
        class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-1 py-1"
    >
        <button
            @click="prev"
            aria-label="Previous month"
            class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
            <ChevronLeft class="h-4 w-4" />
        </button>
        <div class="flex min-w-[150px] items-center justify-center gap-1.5 px-2">
            <Calendar class="h-3.5 w-3.5 text-gray-400" />
            <span class="text-sm font-medium text-gray-700">{{ label }}</span>
        </div>
        <button
            @click="next"
            aria-label="Next month"
            class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
            <ChevronRight class="h-4 w-4" />
        </button>
    </div>
</template>
