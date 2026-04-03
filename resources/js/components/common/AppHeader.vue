<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { LogOut, User, Menu } from 'lucide-vue-next';

const emit = defineEmits<{
    (e: 'toggle-sidebar'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

async function handleLogout() {
    await authStore.logout();
    router.push('/login');
}
</script>

<template>
    <header
        class="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6"
    >
        <button
            class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            @click="emit('toggle-sidebar')"
        >
            <Menu class="h-5 w-5" />
        </button>

        <div class="hidden lg:block"></div>

        <div class="flex items-center gap-2 sm:gap-3">
            <div class="flex items-center gap-2">
                <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                >
                    <User class="h-4 w-4 text-gray-500" />
                </div>
                <span class="hidden text-sm font-medium text-gray-700 sm:inline">
                    {{ authStore.user?.name }}
                </span>
            </div>
            <div class="hidden h-5 w-px bg-gray-200 sm:block"></div>
            <button
                @click="handleLogout"
                class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:px-2.5"
            >
                <LogOut class="h-4 w-4" />
                <span class="hidden text-xs font-medium sm:inline">Logout</span>
            </button>
        </div>
    </header>
</template>
