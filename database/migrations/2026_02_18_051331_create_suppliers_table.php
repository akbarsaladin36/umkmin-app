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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('code', 200)->nullable();
            $table->string('name', 200)->nullable();
            $table->string('phone_number', 30)->nullable();
            $table->text('address')->nullable();
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
        Schema::dropIfExists('suppliers');
    }
};
