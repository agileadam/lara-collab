<?php

use App\Models\OwnerCompany;
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

    $this->company = OwnerCompany::create([
        'name' => 'Test Company',
        'currency_id' => null,
    ]);
});

it('defaults to the D. MMM YYYY date format', function () {
    expect($this->company->refresh()->date_format)->toBe('D. MMM YYYY');
});

it('can update the company date format to an allowed value', function () {
    $response = $this->put(route('settings.company.update'), [
        'name' => 'Test Company',
        'tax' => 0,
        'date_format' => 'YYYY-MM-DD',
    ]);

    $response->assertRedirect();

    expect($this->company->refresh()->date_format)->toBe('YYYY-MM-DD');
});

it('rejects a date format outside the allowed list', function () {
    $response = $this->put(route('settings.company.update'), [
        'name' => 'Test Company',
        'date_format' => 'not-a-real-format',
    ]);

    $response->assertSessionHasErrors('date_format');
    expect($this->company->refresh()->date_format)->toBe('D. MMM YYYY');
});
