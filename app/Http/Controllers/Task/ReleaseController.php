<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Http\Requests\Release\StoreReleaseRequest;
use App\Http\Requests\Release\UpdateReleaseRequest;
use App\Models\Project;
use App\Models\Release;

class ReleaseController extends Controller
{
    public function store(StoreReleaseRequest $request, Project $project)
    {
        $this->authorize('create', [Release::class, $project]);

        $project->releases()->create($request->validated());

        return redirect()->route('projects.edit', $project)->success('Release created', 'A new release was successfully created.');
    }

    public function update(UpdateReleaseRequest $request, Project $project, Release $release)
    {
        $this->authorize('update', [$release, $project]);

        $release->update($request->validated());

        return redirect()->route('projects.edit', $project)->success('Release updated', 'The release was successfully updated.');
    }

    public function destroy(Project $project, Release $release)
    {
        $this->authorize('delete', [$release, $project]);

        $release->delete();

        return redirect()->route('projects.edit', $project)->success('Release deleted', 'The release was successfully deleted.');
    }
}
