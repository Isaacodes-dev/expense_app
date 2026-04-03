<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('savings_goals', function (Blueprint $table) {
            $table->index(['user_id', 'status']);
        });

        Schema::table('savings_contributions', function (Blueprint $table) {
            $table->index(['savings_goal_id', 'contribution_date']);
        });

        Schema::table('budgets', function (Blueprint $table) {
            $table->index(['user_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::table('savings_goals', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'status']);
        });

        Schema::table('savings_contributions', function (Blueprint $table) {
            $table->dropIndex(['savings_goal_id', 'contribution_date']);
        });

        Schema::table('budgets', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'month', 'year']);
        });
    }
};
