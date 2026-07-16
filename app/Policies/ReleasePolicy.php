<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Release;
use App\Models\User;

class ReleasePolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Project $project): bool
    {
        return $user->hasPermissionTo('create release') && $user->hasProjectAccess($project);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Release $release, Project $project): bool
    {
        return $user->hasPermissionTo('edit release') && $user->hasProjectAccess($project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Release $release, Project $project): bool
    {
        return $user->hasPermissionTo('delete release') && $user->hasProjectAccess($project);
    }
}
