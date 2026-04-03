<?php

namespace App\Http\Requests\SavingsContribution;

use Illuminate\Foundation\Http\FormRequest;

class StoreSavingsContributionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'contribution_date' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
