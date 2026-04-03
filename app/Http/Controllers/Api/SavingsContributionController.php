<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SavingsContribution\StoreSavingsContributionRequest;
use App\Http\Requests\SavingsContribution\UpdateSavingsContributionRequest;
use App\Http\Resources\SavingsContributionResource;
use App\Models\SavingsContribution;
use App\Models\SavingsGoal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SavingsContributionController extends Controller
{
    public function index(SavingsGoal $savingsGoal): AnonymousResourceCollection
    {
        $this->authorize('view', $savingsGoal);

        $contributions = $savingsGoal->contributions()
            ->orderByDesc('contribution_date')
            ->get();

        return SavingsContributionResource::collection($contributions);
    }

    public function store(StoreSavingsContributionRequest $request, SavingsGoal $savingsGoal): JsonResponse
    {
        $this->authorize('update', $savingsGoal);

        $contribution = $savingsGoal->contributions()->create($request->validated());

        return response()->json([
            'data' => new SavingsContributionResource($contribution),
        ], 201);
    }

    public function show(SavingsGoal $savingsGoal, SavingsContribution $contribution): JsonResponse
    {
        $this->authorize('view', $savingsGoal);

        return response()->json([
            'data' => new SavingsContributionResource($contribution),
        ]);
    }

    public function update(UpdateSavingsContributionRequest $request, SavingsGoal $savingsGoal, SavingsContribution $contribution): JsonResponse
    {
        $this->authorize('update', $savingsGoal);

        $contribution->update($request->validated());

        return response()->json([
            'data' => new SavingsContributionResource($contribution),
        ]);
    }

    public function destroy(SavingsGoal $savingsGoal, SavingsContribution $contribution): JsonResponse
    {
        $this->authorize('delete', $savingsGoal);

        $contribution->delete();

        return response()->json(null, 204);
    }
}
