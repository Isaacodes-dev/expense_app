import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { User } from '@/types/auth';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const checked = ref(false);
    const loading = ref(false);

    const isAuthenticated = computed(() => !!user.value);

    async function fetchUser() {
        try {
            const response = await authService.getUser();
            user.value = response.data;
        } catch {
            user.value = null;
        } finally {
            checked.value = true;
        }
    }

    async function login(credentials: {
        email: string;
        password: string;
        remember?: boolean;
    }) {
        loading.value = true;
        try {
            const response = await authService.login(credentials);
            user.value = response.data;
            return response;
        } finally {
            loading.value = false;
        }
    }

    async function register(data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }) {
        loading.value = true;
        try {
            const response = await authService.register(data);
            user.value = response.data;
            return response;
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        await authService.logout();
        user.value = null;
    }

    return {
        user,
        checked,
        loading,
        isAuthenticated,
        fetchUser,
        login,
        register,
        logout,
    };
});
