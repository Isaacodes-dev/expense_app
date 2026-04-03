<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '@/components/common/AppSidebar.vue';
import AppHeader from '@/components/common/AppHeader.vue';

const sidebarOpen = ref(false);
const route = useRoute();

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
    sidebarOpen.value = false;
});
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Mobile backdrop -->
        <Transition
            enter-active-class="duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="sidebarOpen"
                class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
                @click="sidebarOpen = false"
            ></div>
        </Transition>

        <!-- Sidebar -->
        <AppSidebar
            :open="sidebarOpen"
            @close="sidebarOpen = false"
        />

        <!-- Main content -->
        <div class="transition-all duration-200 lg:pl-64">
            <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
            <main class="p-4 sm:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
