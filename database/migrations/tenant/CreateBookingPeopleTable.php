<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingPeopleTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_booking_people', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('booking_id');
            $table->enum('type', ['adult', 'child', 'infant', 'pet']);
            //Person
            $table->string('name');
            $table->string('surname');
            $table->string('email')->nullable();
            $table->string('phone_code')->nullable();
            $table->string('phone')->nullable();
            //Document
            $table->string('document')->nullable();
            $table->string('document_type')->nullable();
            $table->string('document_country_code')->nullable();

            //Relations
            $table->foreign('client_id')->references('id')->on($this->tenantId.'_clients')->onDelete('cascade');
            $table->foreign('booking_id')->references('id')->on($this->tenantId.'_bookings')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_booking_people');
    }
}
