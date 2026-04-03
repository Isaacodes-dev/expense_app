<?php

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('expense'));
    }

    public function rules(): array
    {
        return [
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('categories', 'id')->where(fn ($query) =>
                    $query->where('user_id', $this->user()->id)
                ),
            ],
            'date' => ['sometimes', 'required', 'date'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'payment_method' => ['nullable', 'string', 'in:cash,card,bank_transfer,mobile_money,other'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
