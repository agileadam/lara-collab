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
            $table->boolean('mark_tasks_done')->default(false)->after('color');
        });

        DB::table('task_groups')->where('name', 'Done')->update(['mark_tasks_done' => true]);
    }

    public function down()
    {
        Schema::table('task_groups', function (Blueprint $table) {
            $table->dropColumn('mark_tasks_done');
        });
    }
};
