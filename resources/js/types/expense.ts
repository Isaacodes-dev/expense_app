export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'other';

export interface Expense {
    id: number;
    category_id: number;
    category?: {
        id: number;
        name: string;
    };
    date: string;
    amount: string;
    description: string;
    payment_method: PaymentMethod | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface ExpensePayload {
    category_id: number;
    date: string; // YYYY-MM-DD
    amount: number;
    description: string;
    payment_method?: PaymentMethod | null;
    notes?: string | null;
}

export interface ExpenseFilters {
    page?: number;
    per_page?: number;
    category_id?: number;
    date_from?: string;
    date_to?: string;
    payment_method?: PaymentMethod;
}
