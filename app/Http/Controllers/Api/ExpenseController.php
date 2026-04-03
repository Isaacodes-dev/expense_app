<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\StoreExpenseRequest;
use App\Http\Requests\Expense\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExpenseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Expense::with('category:id,name')
            ->when($request->input('category_id'), fn ($q, $v) => $q->where('category_id', $v))
            ->when($request->input('payment_method'), fn ($q, $v) => $q->where('payment_method', $v))
            ->dateRange($request->input('date_from'), $request->input('date_to'))
            ->orderByDesc('date')
            ->orderByDesc('id');

        $perPage = min((int) $request->input('per_page', 20), 100);

        return ExpenseResource::collection($query->paginate($perPage));
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = Expense::create($request->validated());

        $expense->load('category:id,name');

        return response()->json([
            'data' => new ExpenseResource($expense),
        ], 201);
    }

    public function show(Expense $expense): JsonResponse
    {
        $this->authorize('view', $expense);

        $expense->load('category:id,name');

        return response()->json([
            'data' => new ExpenseResource($expense),
        ]);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): JsonResponse
    {
        $expense->update($request->validated());

        $expense->load('category:id,name');

        return response()->json([
            'data' => new ExpenseResource($expense),
        ]);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return response()->json(null, 204);
    }
}
