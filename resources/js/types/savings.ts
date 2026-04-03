export interface SavingsGoal {
    id: number;
    name: string;
    target_amount: string;
    saved_amount: string;
    progress_percentage: number;
    deadline: string | null;
    status: 'active' | 'completed' | 'cancelled';
    description: string | null;
    contributions?: SavingsContribution[];
    created_at: string;
    updated_at: string;
}

export interface SavingsGoalPayload {
    name: string;
    target_amount: number;
    deadline?: string | null;
    status?: string;
    description?: string | null;
}

export interface SavingsContribution {
    id: number;
    savings_goal_id: number;
    amount: string;
    contribution_date: string;
    note: string | null;
    created_at: string;
    updated_at: string;
}

export interface SavingsContributionPayload {
    amount: number;
    contribution_date: string;
    note?: string | null;
}
