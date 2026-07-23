<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class ChecklistItem extends Model implements Sortable
{
    use SortableTrait;

    protected $fillable = ['task_id', 'name', 'completed', 'order_column'];

    protected $casts = [
        'completed' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('ordered', function ($query) {
            $query->ordered();
        });
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
