<script setup lang="ts">
import { useRoute } from 'vue-router';
import { X, LayoutDashboard, Tags, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-vue-next';

defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const route = useRoute();

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Income', path: '/incomes', icon: TrendingUp },
    { name: 'Expenses', path: '/expenses', icon: TrendingDown },
    { name: 'Budgets', path: '/budgets', icon: Wallet },
    { name: 'Savings', path: '/savings', icon: PiggyBank },
];

function isActive(path: string): boolean {
    return route.path === path || route.path.startsWith(path + '/');
}
</script>

<template>
    <aside
        :class="[
            'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200/80 bg-white transition-transform duration-200 ease-in-out',
            open ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0',
        ]"
    >
        <div class="flex h-16 items-center justify-between border-b border-gray-200/80 px-6">
            <div class="flex items-center gap-2.5">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                    <Wallet class="h-4 w-4 text-white" />
                </div>
                <router-link
                    to="/dashboard"
                    class="text-[15px] font-semibold tracking-tight text-gray-900"
                >
                    Finance App
                </router-link>
            </div>
            <button
                class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
                @click="emit('close')"
            >
                <X class="h-5 w-5" />
            </button>
        </div>

        <nav class="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            <router-link
                v-for="item in navItems"
                :key="item.path"
                :to="item.path"
                :class="[
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
                    isActive(item.path)
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                ]"
            >
                <component
                    :is="item.icon"
                    :class="[
                        'h-[18px] w-[18px] flex-shrink-0 transition-colors duration-150',
                        isActive(item.path)
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-gray-600',
                    ]"
                    :stroke-width="isActive(item.path) ? 2.25 : 1.75"
                />
                {{ item.name }}
            </router-link>
        </nav>

        <div class="hidden border-t border-gray-200/80 px-3 py-3 lg:block">
            <div class="rounded-lg bg-gray-50 px-3 py-2.5">
                <p class="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    Personal Finance
                </p>
                <p class="mt-0.5 text-xs text-gray-500">
                    Track. Budget. Save.
                </p>
            </div>
        </div>
    </aside>
</template>
