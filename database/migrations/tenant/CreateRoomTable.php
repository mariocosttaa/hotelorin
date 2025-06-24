<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_rooms', function (Blueprint $table) {
            $table->id();
            //OverWrite
            $table->string('overview_name_pt')->nullable();
            $table->string('overview_name_en')->nullable();
            $table->string('overview_name_es')->nullable();
            $table->string('overview_name_fr')->nullable();
            $table->string('overview_description_pt')->nullable();
            $table->string('overview_description_en')->nullable();
            $table->string('overview_description_es')->nullable();
            $table->string('overview_description_fr')->nullable();
            $table->string('overview_slug_pt')->nullable();
            $table->string('overview_slug_en')->nullable();
            $table->string('overview_slug_es')->nullable();
            $table->string('overview_slug_fr')->nullable();
            //Room
            $table->unsignedBigInteger('room_type_id');
            //Max Capacity
            $table->integer('max_adults')->nullable();
            $table->integer('max_children')->nullable();
            $table->integer('max_infants')->nullable();
            $table->integer('max_pets')->nullable();

            //relations
            $table->foreign('room_type_id')->references('id')->on($this->tenantId.'_room_types')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_rooms');
    }
}
