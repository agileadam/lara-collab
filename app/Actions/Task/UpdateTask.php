<?php

namespace App\Actions\Task;

use App\Enums\PricingType;
use App\Events\Task\TaskUpdated;
use App\Models\Task;
use App\Models\TaskGroup;

class UpdateTask
{
    public function update(Task $task, array $data): void
    {
        $updateField = key($data);

        if ($updateField === 'pricing_type' && $data['pricing_type'] === PricingType::HOURLY->value) {
            $task->update([
                'pricing_type' => PricingType::HOURLY,
                'fixed_price' => null,
            ]);
        }

        if ($updateField === 'fixed_price' && isset($data['fixed_price'])) {
            $data['fixed_price'] = (int) $data['fixed_price'];
        }

        if (! in_array($updateField, ['subscribed_users', 'labels'])) {
            $task->update($data);

            if ($updateField === 'group_id') {
                $task->update(['order_column' => 0]);

                $group = TaskGroup::find($data['group_id']);

                if ($group?->mark_tasks_done && $task->completed_at === null) {
                    $task->update(['completed_at' => now()]);
                } elseif ($group?->reopen_tasks && $task->completed_at !== null) {
                    $task->update(['completed_at' => null]);
                }
            }
        }

        if ($updateField === 'subscribed_users') {
            $task->subscribedUsers()->sync($data['subscribed_users']);
        }

        if ($updateField === 'labels') {
            $task->labels()->sync($data['labels']);
        }

        TaskUpdated::dispatch($task, $updateField);
    }
}
