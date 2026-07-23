<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('releases', function (Blueprint $table) {
            $table->unsignedInteger('order_column')->nullable();
        });

        DB::table('releases')->distinct()->pluck('project_id')->each(function ($projectId) {
            DB::table('releases')
                ->where('project_id', $projectId)
                ->orderBy('target_date')
                ->get(['id'])
                ->each(function ($release, $index) {
                    DB::table('releases')->where('id', $release->id)->update(['order_column' => $index + 1]);
                });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('releases', function (Blueprint $table) {
            $table->dropColumn('order_column');
        });
    }
};
