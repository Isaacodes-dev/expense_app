import type { SavingsContribution, SavingsContributionPayload } from '@/types/savings';
import http from './http';

export const savingsContributionService = {
    async list(goalId: number): Promise<{ data: SavingsContribution[] }> {
        const response = await http.get(`/savings-goals/${goalId}/contributions`);
        return response.data;
    },
    async create(goalId: number, data: SavingsContributionPayload): Promise<{ data: SavingsContribution }> {
        const response = await http.post(`/savings-goals/${goalId}/contributions`, data);
        return response.data;
    },
    async update(goalId: number, id: number, data: Partial<SavingsContributionPayload>): Promise<{ data: SavingsContribution }> {
        const response = await http.put(`/savings-goals/${goalId}/contributions/${id}`, data);
        return response.data;
    },
    async delete(goalId: number, id: number): Promise<void> {
        await http.delete(`/savings-goals/${goalId}/contributions/${id}`);
    },
};
