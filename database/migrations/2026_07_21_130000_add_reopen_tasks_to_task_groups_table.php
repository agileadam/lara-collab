<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->boolean('reopen_tasks')->default(false)->after('mark_tasks_done');
        });

        DB::table('task_groups')
            ->whereIn('name', ['Backlog', 'Todo', 'In progress', 'In Progress', 'QA'])
            ->update(['reopen_tasks' => true]);
    }

    public function down()
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->dropColumn('reopen_tasks');
        });
    }
};
