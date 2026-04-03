<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $budgeted = (float) $this->amount;
        $actual = (float) ($this->actual ?? 0);

        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'month' => $this->month,
            'year' => $this->year,
            'amount' => $this->amount,
            'actual' => number_format($actual, 2, '.', ''),
            'remaining' => number_format($budgeted - $actual, 2, '.', ''),
            'percentage' => $budgeted > 0 ? round($actual / $budgeted * 100, 1) : 0,
            'over_budget' => $actual > $budgeted,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
