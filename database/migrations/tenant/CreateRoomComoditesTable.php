<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomComoditesTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_room_comodites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('comodite_id');
            $table->unsignedBigInteger('room_type_id')->nullable();
            $table->unsignedBigInteger('room_id')->nullable();

            //Relations
            $table->foreign('room_type_id')->references('id')->on($this->tenantId.'_room_types')->onDelete('cascade');
            $table->foreign('room_id')->references('id')->on($this->tenantId.'_rooms')->onDelete('cascade');
            $table->foreign('comodite_id')->references('id')->on($this->tenantId.'_comodites')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_room_comodites');
    }
}
