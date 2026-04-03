export interface Income {
    id: number;
    date: string;
    source: string;
    amount: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface IncomePayload {
    date: string;
    source: string;
    amount: number;
    notes?: string | null;
}

export interface IncomeFilters {
    page?: number;
    per_page?: number;
    date_from?: string;
    date_to?: string;
}
