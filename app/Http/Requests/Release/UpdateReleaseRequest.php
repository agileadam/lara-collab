<?php

namespace App\Http\Requests\Release;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReleaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                Rule::unique('releases', 'name')
                    ->where('project_id', $this->route('project')->id)
                    ->ignore($this->route('release')->id),
            ],
            'color' => [
                'nullable',
                'string',
                'max:16',
            ],
            'target_date' => [
                'nullable',
                'date',
            ],
        ];
    }
}
