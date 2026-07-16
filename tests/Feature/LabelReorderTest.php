<?php

use App\Models\Label;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(PermissionSeeder::class);

    $this->user = User::factory()->create();
    $this->actingAs($this->user);
    $this->user->assignRole('admin');

    $this->labelA = Label::create(['name' => 'Bug', 'color' => '#E03231']);
    $this->labelB = Label::create(['name' => 'Feature', 'color' => '#309E44']);
    $this->labelC = Label::create(['name' => 'Chore', 'color' => '#343A40']);
});

it('assigns sequential order_column values as labels are created', function () {
    expect($this->labelA->order_column)->toBe(1)
        ->and($this->labelB->order_column)->toBe(2)
        ->and($this->labelC->order_column)->toBe(3);
});

it('reorders labels via the reorder endpoint', function () {
    $response = $this->post(route('settings.labels.reorder'), [
        'ids' => [$this->labelC->id, $this->labelA->id, $this->labelB->id],
    ]);

    $response->assertOk();

    expect(Label::orderBy('order_column')->pluck('id')->toArray())
        ->toBe([$this->labelC->id, $this->labelA->id, $this->labelB->id]);
});

it('returns labels from a plain get() query in order_column order', function () {
    $this->post(route('settings.labels.reorder'), [
        'ids' => [$this->labelB->id, $this->labelC->id, $this->labelA->id],
    ]);

    $names = Label::get(['id', 'name'])->pluck('name')->toArray();

    expect($names)->toBe(['Feature', 'Chore', 'Bug']);
});

it('rejects reordering without the reorder label permission', function () {
    $this->user->removeRole('admin');
    $this->user->assignRole('developer');

    $orderBefore = Label::orderBy('order_column')->pluck('id')->toArray();

    $response = $this->post(route('settings.labels.reorder'), [
        'ids' => [$this->labelC->id, $this->labelB->id, $this->labelA->id],
    ]);

    $response->assertRedirect();
    expect(session('flash.type'))->toBe('error');
    expect(Label::orderBy('order_column')->pluck('id')->toArray())->toBe($orderBefore);
});
