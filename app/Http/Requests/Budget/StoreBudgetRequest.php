<?php

namespace App\Http\Requests\Budget;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBudgetRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id' => [
                'required', 'integer',
                Rule::exists('categories', 'id')->where(fn ($q) => $q->where('user_id', $this->user()->id)),
            ],
            'month' => ['required', 'integer', 'between:1,12'],
            'year' => ['required', 'integer', 'between:2020,2100'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (!$validator->errors()->any()) {
                $exists = \App\Models\Budget::where('user_id', $this->user()->id)
                    ->where('category_id', $this->category_id)
                    ->where('month', $this->month)
                    ->where('year', $this->year)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add('category_id', 'A budget for this category already exists for this month.');
                }
            }
        });
    }
}
