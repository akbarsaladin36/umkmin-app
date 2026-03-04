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
        Schema::create('products', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('category_id', false)->nullable();
            $table->string('code', 200)->nullable();
            $table->string('name', 200)->nullable();
            $table->string('barcode', 200)->nullable();
            $table->string('cost_price', 30)->nullable();
            $table->string('selling_price', 30)->nullable();
            $table->integer('stock', false)->nullable();
            $table->integer('min_stock', false)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->string('created_by', 200)->nullable();
            $table->string('created_by_username', 150)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->string('updated_by', 200)->nullable();
            $table->string('updated_by_username', 150)->nullable();

            $table->index('code', 'products_code_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
