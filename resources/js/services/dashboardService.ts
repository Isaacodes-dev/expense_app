import http from './http';

export interface DashboardData {
    period: { month: number; year: number };
    totals: {
        income: string;
        expenses: string;
        savings: string;
        carried_forward: string;
        balance: string;
    };
    expenses_by_category: Array<{
        category_id: number;
        category_name: string;
        total: string;
    }>;
    budget_summary: Array<{
        category_name: string;
        budgeted: string;
        actual: string;
        remaining: string;
        percentage: number;
        over_budget: boolean;
    }>;
    savings_overview: Array<{
        id: number;
        name: string;
        target: string;
        saved: string;
        progress_percentage: number;
        deadline: string | null;
    }>;
    recent_transactions: Array<{
        id: number;
        type: 'income' | 'expense';
        date: string;
        description: string;
        amount: string;
        category: string | null;
    }>;
}

export const dashboardService = {
    async get(params?: {
        month?: number;
        year?: number;
    }): Promise<{ data: DashboardData }> {
        const response = await http.get('/dashboard', { params });
        return response.data;
    },
};
