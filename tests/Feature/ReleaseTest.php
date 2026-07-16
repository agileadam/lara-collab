<?php

use App\Actions\Task\CreateTask;
use App\Models\ClientCompany;
use App\Models\Project;
use App\Models\Release;
use App\Models\Task;
use App\Models\TaskGroup;
use App\Models\User;
use Database\Seeders\CountrySeeder;
use Database\Seeders\CurrencySeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(CountrySeeder::class);
    $this->seed(CurrencySeeder::class);
    $this->seed(RoleSeeder::class);
    $this->seed(PermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->actingAs($this->user);
    $this->user->assignRole('admin');

    $clientCompany = ClientCompany::factory()->create();

    $this->project = Project::create([
        'client_company_id' => $clientCompany->id,
        'name' => 'Test Project',
        'hourly_rate' => 5000,
        'default_pricing_type' => 'hourly',
    ]);

    $this->taskGroup = TaskGroup::create([
        'project_id' => $this->project->id,
        'name' => 'To Do',
        'color' => 'blue',
    ]);
});

it('can create a release for a project', function () {
    $response = $this->post(route('projects.releases.store', $this->project), [
        'name' => '1.0.1',
        'color' => '#2771C2',
        'target_date' => '2026-08-01',
    ]);

    $response->assertRedirect();

    expect(Release::where('project_id', $this->project->id)->where('name', '1.0.1')->exists())->toBeTrue();
});

it('rejects a duplicate release name within the same project', function () {
    Release::create(['project_id' => $this->project->id, 'name' => '1.0.1']);

    $response = $this->post(route('projects.releases.store', $this->project), [
        'name' => '1.0.1',
    ]);

    $response->assertSessionHasErrors('name');
});

it('allows the same release name across different projects', function () {
    Release::create(['project_id' => $this->project->id, 'name' => '1.0.1']);

    $otherCompany = ClientCompany::factory()->create();
    $otherProject = Project::create([
        'client_company_id' => $otherCompany->id,
        'name' => 'Other Project',
        'hourly_rate' => 5000,
        'default_pricing_type' => 'hourly',
    ]);

    $response = $this->post(route('projects.releases.store', $otherProject), [
        'name' => '1.0.1',
    ]);

    $response->assertRedirect();
    expect(Release::where('project_id', $otherProject->id)->where('name', '1.0.1')->exists())->toBeTrue();
});

it('can update a release without tripping its own uniqueness check', function () {
    $release = Release::create(['project_id' => $this->project->id, 'name' => '1.0.1']);

    $response = $this->put(route('projects.releases.update', [$this->project, $release]), [
        'name' => '1.0.1',
        'color' => '#309E44',
        'target_date' => '2026-09-01',
    ]);

    $response->assertRedirect();
    $release->refresh();

    expect($release->color)->toBe('#309E44')
        ->and($release->target_date->format('Y-m-d'))->toBe('2026-09-01');
});

it('nulls out release_id on tasks when the release is deleted', function () {
    $release = Release::create(['project_id' => $this->project->id, 'name' => '1.0.1']);

    $task = (new CreateTask)->create($this->project, [
        'name' => 'Task with release',
        'group_id' => $this->taskGroup->id,
        'assigned_to_user_id' => null,
        'description' => null,
        'due_on' => null,
        'estimation' => null,
        'priority_id' => null,
        'release_id' => $release->id,
        'pricing_type' => 'hourly',
        'fixed_price' => null,
        'hidden_from_clients' => false,
        'billable' => true,
    ]);

    expect($task->release_id)->toBe($release->id);

    $this->delete(route('projects.releases.destroy', [$this->project, $release]));

    $task->refresh();
    expect($task->release_id)->toBeNull();
});

it('can create a task without a release', function () {
    $task = (new CreateTask)->create($this->project, [
        'name' => 'Task without release',
        'group_id' => $this->taskGroup->id,
        'assigned_to_user_id' => null,
        'description' => null,
        'due_on' => null,
        'estimation' => null,
        'priority_id' => null,
        'release_id' => null,
        'pricing_type' => 'hourly',
        'fixed_price' => null,
        'hidden_from_clients' => false,
        'billable' => true,
    ]);

    expect($task)->toBeInstanceOf(Task::class)
        ->and($task->release_id)->toBeNull();
});
