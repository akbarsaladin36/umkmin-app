<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cash_transactions', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('code', 200)->nullable();
            $table->string('category', 30)->nullable();
            $table->string('amount', 30)->nullable();
            $table->text('description')->nullable();
            $table->string('status', 30)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->string('created_by', 200)->nullable();
            $table->string('created_by_username', 150)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->string('updated_by', 200)->nullable();
            $table->string('updated_by_username', 150)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
    }
};
