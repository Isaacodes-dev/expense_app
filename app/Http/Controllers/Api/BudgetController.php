<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\StoreBudgetRequest;
use App\Http\Requests\Budget\UpdateBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;

class BudgetController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $month = (int) $request->input('month', now()->month);
        $year = (int) $request->input('year', now()->year);

        $budgets = Budget::where('month', $month)
            ->where('year', $year)
            ->with('category:id,name')
            ->get();

        $actualByCategory = self::getActualByCategory($month, $year);

        $budgets->each(function ($budget) use ($actualByCategory) {
            $budget->actual = (float) ($actualByCategory->get($budget->category_id, 0));
        });

        return BudgetResource::collection($budgets);
    }

    public function store(StoreBudgetRequest $request): JsonResponse
    {
        $budget = Budget::create($request->validated());

        $budget->load('category:id,name');
        $budget->actual = 0;

        return response()->json([
            'data' => new BudgetResource($budget),
        ], 201);
    }

    public function show(Budget $budget): JsonResponse
    {
        $this->authorize('view', $budget);

        $budget->load('category:id,name');
        $budget->actual = (float) $this->getActualForBudget($budget);

        return response()->json([
            'data' => new BudgetResource($budget),
        ]);
    }

    public function update(UpdateBudgetRequest $request, Budget $budget): JsonResponse
    {
        $budget->update($request->validated());
        $budget->load('category:id,name');
        $budget->actual = (float) $this->getActualForBudget($budget);

        return response()->json([
            'data' => new BudgetResource($budget),
        ]);
    }

    public function destroy(Budget $budget): JsonResponse
    {
        $this->authorize('delete', $budget);

        $budget->delete();

        return response()->json(null, 204);
    }

    public static function getActualByCategory(int $month, int $year): Collection
    {
        return Expense::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->pluck('total', 'category_id');
    }

    private function getActualForBudget(Budget $budget): float
    {
        return (float) Expense::where('category_id', $budget->category_id)
            ->whereMonth('date', $budget->month)
            ->whereYear('date', $budget->year)
            ->sum('amount');
    }
}
