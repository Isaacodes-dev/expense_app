<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SavingsGoal\StoreSavingsGoalRequest;
use App\Http\Requests\SavingsGoal\UpdateSavingsGoalRequest;
use App\Http\Resources\SavingsGoalResource;
use App\Models\SavingsGoal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SavingsGoalController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $goals = SavingsGoal::query()
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->withSum('contributions', 'amount')
            ->orderByDesc('created_at')
            ->get();

        return SavingsGoalResource::collection($goals);
    }

    public function store(StoreSavingsGoalRequest $request): JsonResponse
    {
        $goal = SavingsGoal::create($request->validated());

        $goal->contributions_sum_amount = 0;

        return response()->json([
            'data' => new SavingsGoalResource($goal),
        ], 201);
    }

    public function show(SavingsGoal $savingsGoal): JsonResponse
    {
        $this->authorize('view', $savingsGoal);

        $savingsGoal->loadSum('contributions', 'amount');
        $savingsGoal->load(['contributions' => fn ($q) => $q->orderByDesc('contribution_date')]);

        return response()->json([
            'data' => new SavingsGoalResource($savingsGoal),
        ]);
    }

    public function update(UpdateSavingsGoalRequest $request, SavingsGoal $savingsGoal): JsonResponse
    {
        $savingsGoal->update($request->validated());
        $savingsGoal->loadSum('contributions', 'amount');

        return response()->json([
            'data' => new SavingsGoalResource($savingsGoal),
        ]);
    }

    public function destroy(SavingsGoal $savingsGoal): JsonResponse
    {
        $this->authorize('delete', $savingsGoal);

        $savingsGoal->delete();

        return response()->json(null, 204);
    }
}
