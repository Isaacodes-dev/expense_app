import type { Category, CategoryPayload } from '@/types/category';
import http from './http';

export const categoryService = {
    async list(params?: {
        active_only?: boolean;
    }): Promise<{ data: Category[] }> {
        const response = await http.get('/categories', { params });
        return response.data;
    },

    async get(id: number): Promise<{ data: Category }> {
        const response = await http.get(`/categories/${id}`);
        return response.data;
    },

    async create(data: CategoryPayload): Promise<{ data: Category }> {
        const response = await http.post('/categories', data);
        return response.data;
    },

    async update(
        id: number,
        data: CategoryPayload
    ): Promise<{ data: Category }> {
        const response = await http.put(`/categories/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await http.delete(`/categories/${id}`);
    },
};
