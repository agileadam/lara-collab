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
        Permission::firstOrCreate(['name' => 'reorder label', 'guard_name' => 'web']);

        $admin = Role::whereName('admin')->first();
        if ($admin) {
            $admin->givePermissionTo('reorder label');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $admin = Role::whereName('admin')->first();
        if ($admin) {
            $admin->revokePermissionTo('reorder label');
        }

        Permission::whereName('reorder label')->delete();
    }
};
