<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class TaskGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();

        foreach ($projects as $project) {
            $project->taskGroups()->createMany([
                ['name' => 'Backlog', 'reopen_tasks' => true],
                ['name' => 'Todo', 'reopen_tasks' => true],
                ['name' => 'In Progress', 'reopen_tasks' => true],
                ['name' => 'QA', 'reopen_tasks' => true],
                ['name' => 'Done', 'mark_tasks_done' => true],
                ['name' => 'Deployed'],
            ]);
        }
    }
}
