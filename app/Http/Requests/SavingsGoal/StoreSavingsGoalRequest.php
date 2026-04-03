<?php

namespace App\Http\Requests\SavingsGoal;

use Illuminate\Foundation\Http\FormRequest;

class StoreSavingsGoalRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'target_amount' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'deadline' => ['nullable', 'date'],
            'status' => ['sometimes', 'string', 'in:active,completed,cancelled'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
