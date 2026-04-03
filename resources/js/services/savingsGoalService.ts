import type { SavingsGoal, SavingsGoalPayload } from '@/types/savings';
import http from './http';

export const savingsGoalService = {
    async list(params?: { status?: string }): Promise<{ data: SavingsGoal[] }> {
        const response = await http.get('/savings-goals', { params });
        return response.data;
    },
    async get(id: number): Promise<{ data: SavingsGoal }> {
        const response = await http.get(`/savings-goals/${id}`);
        return response.data;
    },
    async create(data: SavingsGoalPayload): Promise<{ data: SavingsGoal }> {
        const response = await http.post('/savings-goals', data);
        return response.data;
    },
    async update(id: number, data: Partial<SavingsGoalPayload>): Promise<{ data: SavingsGoal }> {
        const response = await http.put(`/savings-goals/${id}`, data);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await http.delete(`/savings-goals/${id}`);
    },
};
