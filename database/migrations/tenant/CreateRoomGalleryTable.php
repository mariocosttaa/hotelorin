<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomGalleryTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_room_galleries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('room_type_id')->nullable();
            $table->unsignedBigInteger('room_id')->nullable();
            $table->enum('type', ['image', 'video']);
            $table->string('src');

            //Relations
            $table->foreign('room_type_id')->references('id')->on($this->tenantId.'_room_types')->onDelete('cascade');
            $table->foreign('room_id')->references('id')->on($this->tenantId.'_rooms')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_room_galleries');
    }
}
