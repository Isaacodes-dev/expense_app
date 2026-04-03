<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Income\StoreIncomeRequest;
use App\Http\Requests\Income\UpdateIncomeRequest;
use App\Http\Resources\IncomeResource;
use App\Models\Income;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class IncomeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Income::query()
            ->dateRange($request->input('date_from'), $request->input('date_to'))
            ->orderByDesc('date')
            ->orderByDesc('id');

        $perPage = min((int) $request->input('per_page', 20), 100);

        return IncomeResource::collection($query->paginate($perPage));
    }

    public function store(StoreIncomeRequest $request): JsonResponse
    {
        $income = Income::create($request->validated());

        return response()->json([
            'data' => new IncomeResource($income),
        ], 201);
    }

    public function show(Income $income): JsonResponse
    {
        $this->authorize('view', $income);

        return response()->json([
            'data' => new IncomeResource($income),
        ]);
    }

    public function update(UpdateIncomeRequest $request, Income $income): JsonResponse
    {
        $income->update($request->validated());

        return response()->json([
            'data' => new IncomeResource($income),
        ]);
    }

    public function destroy(Income $income): JsonResponse
    {
        $this->authorize('delete', $income);

        $income->delete();

        return response()->json(null, 204);
    }
}
