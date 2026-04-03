<?php

namespace App\Http\Requests\Income;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncomeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('income'));
    }

    public function rules(): array
    {
        return [
            'date' => ['sometimes', 'required', 'date'],
            'source' => ['sometimes', 'required', 'string', 'max:150'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
