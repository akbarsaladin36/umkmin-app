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
        Schema::create('users', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('uuid', 200)->nullable();
            $table->string('username', 150)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('password', 150)->nullable();
            $table->string('first_name', 150)->nullable();
            $table->string('last_name', 150)->nullable();
            $table->text('address')->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->integer('role_id', false)->nullable();
            $table->integer('is_active', false)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->string('created_by', 200)->nullable();
            $table->string('created_by_username', 150)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->string('updated_by', 200)->nullable();
            $table->string('updated_by_username', 150)->nullable();

            $table->index('uuid', 'users_uuid_key');
            $table->index('username', 'users_username_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
