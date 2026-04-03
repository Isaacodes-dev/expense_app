<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SavingsGoalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $saved = (float) ($this->contributions_sum_amount ?? 0);
        $target = (float) $this->target_amount;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'target_amount' => $this->target_amount,
            'saved_amount' => number_format($saved, 2, '.', ''),
            'progress_percentage' => $target > 0 ? round($saved / $target * 100, 1) : 0,
            'deadline' => $this->deadline?->toDateString(),
            'status' => $this->status,
            'description' => $this->description,
            'contributions' => SavingsContributionResource::collection($this->whenLoaded('contributions')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
