<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingPaymentTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_booking_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('amount');
            $table->string('currency_code');
            $table->enum('status', ['pending', 'processing', 'paid', 'cancelled', 'expired']);

            //Relations
            $table->foreign('invoice_id')->references('id')->on($this->tenantId.'_booking_invoices')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_booking_payments');
    }
}
