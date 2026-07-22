<?php

namespace App\Models\Filters;

use Illuminate\Database\Eloquent\Builder;
use Lacodix\LaravelModelFilter\Filters\Filter;

class ReleaseFilter extends Filter
{
    public function __construct(protected string $field) {}

    public function apply(Builder $query): Builder
    {
        $notSet = in_array('not_set', $this->values, true);
        $ids = array_values(array_filter($this->values, fn ($value) => $value !== 'not_set'));

        return $query->where(function (Builder $query) use ($ids, $notSet) {
            if ($ids !== []) {
                $query->orWhereIn($this->field, $ids);
            }

            if ($notSet) {
                $query->orWhereNull($this->field);
            }
        });
    }
}
