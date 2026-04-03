import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

let fetchingUser: Promise<void> | null = null;

export function setupGuards(router: Router): void {
    router.beforeEach(async (to) => {
        const authStore = useAuthStore();

        if (!authStore.checked) {
            if (!fetchingUser) {
                fetchingUser = authStore.fetchUser();
            }

            await fetchingUser;
        }

        if (to.meta.requiresAuth && !authStore.isAuthenticated) {
            return { name: 'login', query: { redirect: to.fullPath } };
        }

        if (to.meta.guest && authStore.isAuthenticated) {
            return { name: 'dashboard' };
        }
    });
}
