<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePresenceActivityTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_presence_activities', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->datetime('check_in');
            $table->datetime('check_out');
            $table->integer('time_worked');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_presence_activities');
    }
}
