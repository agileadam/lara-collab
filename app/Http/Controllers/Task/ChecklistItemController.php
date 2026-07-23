<?php

namespace App\Http\Controllers\Task;

use App\Events\Task\ChecklistItemCreated;
use App\Events\Task\ChecklistItemDeleted;
use App\Events\Task\ChecklistItemOrderChanged;
use App\Events\Task\ChecklistItemUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChecklistItem\StoreChecklistItemRequest;
use App\Http\Requests\ChecklistItem\UpdateChecklistItemRequest;
use App\Models\ChecklistItem;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChecklistItemController extends Controller
{
    public function store(StoreChecklistItemRequest $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', [$task, $project]);

        $checklistItem = $task->checklistItems()->create($request->validated());

        ChecklistItemCreated::dispatch($task, $checklistItem);

        return response()->json(['checklistItem' => $checklistItem]);
    }

    public function update(UpdateChecklistItemRequest $request, Project $project, Task $task, ChecklistItem $checklistItem): JsonResponse
    {
        $this->authorize('update', [$task, $project]);

        $checklistItem->update($request->validated());

        ChecklistItemUpdated::dispatch($task, $checklistItem);

        return response()->json();
    }

    public function destroy(Project $project, Task $task, ChecklistItem $checklistItem): JsonResponse
    {
        $this->authorize('update', [$task, $project]);

        $checklistItemId = $checklistItem->id;
        $checklistItem->delete();

        ChecklistItemDeleted::dispatch($task, $checklistItemId);

        return response()->json();
    }

    public function reorder(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', [$task, $project]);

        ChecklistItem::setNewOrder($request->ids);

        ChecklistItemOrderChanged::dispatch($task, $request->ids);

        return response()->json();
    }
}
