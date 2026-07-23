<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Permission::firstOrCreate(['name' => 'reorder release', 'guard_name' => 'web']);

        foreach (['admin', 'manager'] as $roleName) {
            $role = Role::whereName($roleName)->first();
            if ($role) {
                $role->givePermissionTo('reorder release');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (['admin', 'manager'] as $roleName) {
            $role = Role::whereName($roleName)->first();
            if ($role) {
                $role->revokePermissionTo('reorder release');
            }
        }

        Permission::whereName('reorder release')->delete();
    }
};
