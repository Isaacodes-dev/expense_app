import type { Income, IncomePayload, IncomeFilters } from '@/types/income';
import type { PaginatedResponse } from '@/types/api';
import http from './http';

export const incomeService = {
    async list(params?: IncomeFilters): Promise<PaginatedResponse<Income>> {
        const response = await http.get('/incomes', { params });
        return response.data;
    },

    async get(id: number): Promise<{ data: Income }> {
        const response = await http.get(`/incomes/${id}`);
        return response.data;
    },

    async create(data: IncomePayload): Promise<{ data: Income }> {
        const response = await http.post('/incomes', data);
        return response.data;
    },

    async update(id: number, data: IncomePayload): Promise<{ data: Income }> {
        const response = await http.put(`/incomes/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await http.delete(`/incomes/${id}`);
    },
};
