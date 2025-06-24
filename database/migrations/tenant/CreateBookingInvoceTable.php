<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingInvoceTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_booking_invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('amount');
            $table->string('currency_code');
            //Attchments
            $table->unsignedBigInteger('attachment_id_pending')->nullable();
            $table->unsignedBigInteger('attachment_id_paid')->nullable();

            //Status
            $table->enum('status', ['pending', 'paid', 'cancelled', 'expired']);

            //Relations
            $table->foreign('client_id')->references('id')->on($this->tenantId.'_clients')->onDelete('cascade');
            $table->foreign('booking_id')->references('id')->on($this->tenantId.'_bookings')->onDelete('cascade');
            $table->foreign('attachment_id_pending')->references('id')->on($this->tenantId.'_attachments')->onDelete('cascade');
            $table->foreign('attachment_id_paid')->references('id')->on($this->tenantId.'_attachments')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_booking_invoices');
    }
}
