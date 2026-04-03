<?php

namespace App\Services;

use App\Http\Controllers\Api\BudgetController;
use App\Models\Budget;
use App\Models\Expense;
use App\Models\Income;
use App\Models\SavingsContribution;
use App\Models\SavingsGoal;

class DashboardService
{
    public function getSummary(int $month, int $year): array
    {
        $totalIncome = (float) Income::forMonth($month, $year)->sum('amount');

        $totalExpenses = (float) Expense::forMonth($month, $year)->sum('amount');

        $totalSavings = (float) SavingsContribution::whereHas('savingsGoal')
            ->whereMonth('contribution_date', $month)
            ->whereYear('contribution_date', $year)
            ->sum('amount');

        $carriedForward = $this->getCarriedForwardBalance($month, $year);

        $expensesByCategory = Expense::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->with('category:id,name')
            ->get()
            ->map(fn ($e) => [
                'category_id' => $e->category_id,
                'category_name' => $e->category->name,
                'total' => number_format((float) $e->total, 2, '.', ''),
            ]);

        $budgetSummary = $this->getBudgetSummary($month, $year);

        $savingsOverview = SavingsGoal::where('status', 'active')
            ->withSum('contributions', 'amount')
            ->get()
            ->map(fn ($goal) => [
                'id' => $goal->id,
                'name' => $goal->name,
                'target' => $goal->target_amount,
                'saved' => number_format((float) ($goal->contributions_sum_amount ?? 0), 2, '.', ''),
                'progress_percentage' => $goal->target_amount > 0
                    ? round((float) ($goal->contributions_sum_amount ?? 0) / (float) $goal->target_amount * 100, 1)
                    : 0,
                'deadline' => $goal->deadline?->toDateString(),
            ]);

        $recentTransactions = $this->getRecentTransactions();

        $currentBalance = $totalIncome - $totalExpenses - $totalSavings;

        return [
            'period' => ['month' => $month, 'year' => $year],
            'totals' => [
                'income' => number_format($totalIncome, 2, '.', ''),
                'expenses' => number_format($totalExpenses, 2, '.', ''),
                'savings' => number_format($totalSavings, 2, '.', ''),
                'carried_forward' => number_format($carriedForward, 2, '.', ''),
                'balance' => number_format($carriedForward + $currentBalance, 2, '.', ''),
            ],
            'expenses_by_category' => $expensesByCategory,
            'budget_summary' => $budgetSummary,
            'savings_overview' => $savingsOverview,
            'recent_transactions' => $recentTransactions,
        ];
    }

    private function getCarriedForwardBalance(int $month, int $year): float
    {
        $startOfMonth = sprintf('%04d-%02d-01', $year, $month);

        $priorIncome = (float) Income::where('date', '<', $startOfMonth)->sum('amount');
        $priorExpenses = (float) Expense::where('date', '<', $startOfMonth)->sum('amount');
        $priorSavings = (float) SavingsContribution::whereHas('savingsGoal')
            ->where('contribution_date', '<', $startOfMonth)
            ->sum('amount');

        return $priorIncome - $priorExpenses - $priorSavings;
    }

    private function getBudgetSummary(int $month, int $year): array
    {
        $budgets = Budget::where('month', $month)
            ->where('year', $year)
            ->with('category:id,name')
            ->get();

        $actualByCategory = BudgetController::getActualByCategory($month, $year);

        return $budgets->map(fn ($budget) => [
            'category_name' => $budget->category->name,
            'budgeted' => $budget->amount,
            'actual' => number_format((float) $actualByCategory->get($budget->category_id, 0), 2, '.', ''),
            'remaining' => number_format((float) $budget->amount - (float) $actualByCategory->get($budget->category_id, 0), 2, '.', ''),
            'percentage' => $budget->amount > 0
                ? round((float) $actualByCategory->get($budget->category_id, 0) / (float) $budget->amount * 100, 1)
                : 0,
            'over_budget' => (float) $actualByCategory->get($budget->category_id, 0) > (float) $budget->amount,
        ])->toArray();
    }

    private function getRecentTransactions(int $limit = 10): array
    {
        $incomes = Income::orderByDesc('date')
            ->limit($limit)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'type' => 'income',
                'date' => $i->date->toDateString(),
                'description' => $i->source,
                'amount' => $i->amount,
                'category' => null,
            ]);

        $expenses = Expense::with('category:id,name')
            ->orderByDesc('date')
            ->limit($limit)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'type' => 'expense',
                'date' => $e->date->toDateString(),
                'description' => $e->description,
                'amount' => $e->amount,
                'category' => $e->category->name,
            ]);

        return $incomes->concat($expenses)
            ->sortByDesc('date')
            ->take($limit)
            ->values()
            ->toArray();
    }
}
