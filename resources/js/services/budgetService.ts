import type { Budget, BudgetPayload } from '@/types/budget';
import http from './http';

export const budgetService = {
    async list(params?: { month?: number; year?: number }): Promise<{ data: Budget[] }> {
        const response = await http.get('/budgets', { params });
        return response.data;
    },
    async get(id: number): Promise<{ data: Budget }> {
        const response = await http.get(`/budgets/${id}`);
        return response.data;
    },
    async create(data: BudgetPayload): Promise<{ data: Budget }> {
        const response = await http.post('/budgets', data);
        return response.data;
    },
    async update(id: number, data: Partial<BudgetPayload>): Promise<{ data: Budget }> {
        const response = await http.put(`/budgets/${id}`, data);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await http.delete(`/budgets/${id}`);
    },
};
