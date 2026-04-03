<?php

namespace App\Http\Requests\SavingsContribution;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSavingsContributionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'amount' => ['sometimes', 'required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'contribution_date' => ['sometimes', 'required', 'date'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
