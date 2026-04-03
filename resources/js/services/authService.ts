import type { User } from '@/types/auth';
import axios from 'axios';
import http from './http';

export const authService = {
    async csrfCookie(): Promise<void> {
        await axios.get('/sanctum/csrf-cookie');
    },

    async login(credentials: {
        email: string;
        password: string;
        remember?: boolean;
    }): Promise<{ data: User }> {
        await this.csrfCookie();
        const response = await http.post('/login', credentials);
        return response.data;
    },

    async register(data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<{ data: User }> {
        await this.csrfCookie();
        const response = await http.post('/register', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await http.post('/logout');
    },

    async getUser(): Promise<{ data: User }> {
        const response = await http.get('/user');
        return response.data;
    },
};
