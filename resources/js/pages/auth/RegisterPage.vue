<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { User, Mail, Lock } from 'lucide-vue-next';
import type { AxiosError } from 'axios';
import { useNotificationStore } from '@/composables/useNotification';

const router = useRouter();
const authStore = useAuthStore();
const notify = useNotificationStore();

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const errors = ref<Record<string, string[]>>({});
const generalError = ref('');

async function submit() {
    errors.value = {};
    generalError.value = '';

    try {
        await authStore.register(form);
        notify.success('Welcome!', 'Your account has been created.');
        router.push('/dashboard');
    } catch (err) {
        const error = err as AxiosError<{
            message?: string;
            errors?: Record<string, string[]>;
        }>;

        if (error.response?.status === 422 && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            generalError.value = 'Something went wrong. Please try again.';
            notify.error('Error', 'Something went wrong. Please try again.');
        }
    }
}
</script>

<template>
    <div>
        <h2 class="mb-1 text-lg font-semibold text-gray-900">Create account</h2>
        <p class="mb-6 text-sm text-gray-500">Start tracking your finances</p>

        <div v-if="generalError" class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ generalError }}
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label for="name" class="mb-1.5 block text-[13px] font-medium text-gray-700">Full name</label>
                <div class="relative">
                    <User class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input id="name" v-model="form.name" type="text" required autocomplete="name"
                        placeholder="Your name"
                        class="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none" />
                </div>
                <p v-if="errors.name" class="mt-1.5 text-xs text-red-600">{{ errors.name[0] }}</p>
            </div>

            <div>
                <label for="email" class="mb-1.5 block text-[13px] font-medium text-gray-700">Email address</label>
                <div class="relative">
                    <Mail class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input id="email" v-model="form.email" type="email" required autocomplete="email"
                        placeholder="you@example.com"
                        class="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none" />
                </div>
                <p v-if="errors.email" class="mt-1.5 text-xs text-red-600">{{ errors.email[0] }}</p>
            </div>

            <div>
                <label for="password" class="mb-1.5 block text-[13px] font-medium text-gray-700">Password</label>
                <div class="relative">
                    <Lock class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input id="password" v-model="form.password" type="password" required autocomplete="new-password"
                        placeholder="Create a password"
                        class="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none" />
                </div>
                <p v-if="errors.password" class="mt-1.5 text-xs text-red-600">{{ errors.password[0] }}</p>
            </div>

            <div>
                <label for="password_confirmation" class="mb-1.5 block text-[13px] font-medium text-gray-700">Confirm password</label>
                <div class="relative">
                    <Lock class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input id="password_confirmation" v-model="form.password_confirmation" type="password" required autocomplete="new-password"
                        placeholder="Confirm your password"
                        class="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm shadow-sm transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none" />
                </div>
            </div>

            <button type="submit" :disabled="authStore.loading"
                class="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 disabled:opacity-50">
                {{ authStore.loading ? 'Creating account...' : 'Create account' }}
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
            Already have an account?
            <router-link to="/login" class="font-medium text-gray-900 hover:underline">Sign in</router-link>
        </p>
    </div>
</template>
