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
        $perms = ['create release', 'edit release', 'delete release'];

        foreach ($perms as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        $admin = Role::whereName('admin')->first();
        if ($admin) {
            foreach ($perms as $perm) {
                $admin->givePermissionTo($perm);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $perms = ['create release', 'edit release', 'delete release'];

        $admin = Role::whereName('admin')->first();
        if ($admin) {
            foreach ($perms as $perm) {
                $admin->revokePermissionTo($perm);
            }
        }

        Permission::whereIn('name', $perms)->delete();
    }
};
