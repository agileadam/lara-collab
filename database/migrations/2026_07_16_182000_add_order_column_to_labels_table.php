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
        Schema::table('labels', function (Blueprint $table) {
            $table->unsignedInteger('order_column')->nullable();
        });

        DB::table('labels')->orderBy('id')->get(['id'])->each(function ($label, $index) {
            DB::table('labels')->where('id', $label->id)->update(['order_column' => $index + 1]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('labels', function (Blueprint $table) {
            $table->dropColumn('order_column');
        });
    }
};
