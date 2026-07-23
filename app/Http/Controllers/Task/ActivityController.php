<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class ActivityController extends Controller
{
    public function index(Project $project, Task $task): JsonResponse
    {
        $this->authorize('viewAny', [Task::class, $project]);

        return response()->json(
            $task->activities()->latest()->get(['id', 'title', 'subtitle', 'created_at'])
        );
    }
}
