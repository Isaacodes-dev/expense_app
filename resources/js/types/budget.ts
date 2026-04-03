export interface Budget {
    id: number;
    category_id: number;
    category?: { id: number; name: string };
    month: number;
    year: number;
    amount: string;
    actual: string;
    remaining: string;
    percentage: number;
    over_budget: boolean;
    created_at: string;
    updated_at: string;
}

export interface BudgetPayload {
    category_id: number;
    month: number;
    year: number;
    amount: number;
}
