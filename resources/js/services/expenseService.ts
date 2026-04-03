import type { Expense, ExpensePayload, ExpenseFilters } from '@/types/expense';
import type { PaginatedResponse } from '@/types/api';
import http from './http';

export const expenseService = {
    async list(params?: ExpenseFilters): Promise<PaginatedResponse<Expense>> {
        const response = await http.get('/expenses', { params });
        return response.data;
    },

    async get(id: number): Promise<{ data: Expense }> {
        const response = await http.get(`/expenses/${id}`);
        return response.data;
    },

    async create(data: ExpensePayload): Promise<{ data: Expense }> {
        const response = await http.post('/expenses', data);
        return response.data;
    },

    async update(
        id: number,
        data: ExpensePayload
    ): Promise<{ data: Expense }> {
        const response = await http.put(`/expenses/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await http.delete(`/expenses/${id}`);
    },
};
