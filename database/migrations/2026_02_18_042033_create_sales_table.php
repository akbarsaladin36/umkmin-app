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
        Schema::create('sales', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('code', 200)->nullable();
            $table->string('invoice_no', 200)->nullable();
            $table->string('user_uuid', 200)->nullable();
            $table->string('total_amount', 30)->nullable();
            $table->string('discount', 30)->nullable();
            $table->string('final_amount', 30)->nullable();
            $table->string('payment_method', 30)->nullable();
            $table->string('paid_amount', 30)->nullable();
            $table->string('change_amount', 30)->nullable();
            $table->string('status', 15)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->string('created_by', 200)->nullable();
            $table->string('created_by_username', 150)->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->string('updated_by', 200)->nullable();
            $table->string('updated_by_username', 150)->nullable();

            $table->index('code', 'sales_code_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
