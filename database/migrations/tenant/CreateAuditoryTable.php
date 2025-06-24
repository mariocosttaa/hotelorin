<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuditoryTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_auditories', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->bigInteger('user_id');
            $table->string('action_en')->nullable();
            $table->string('action_pt')->nullable();
            $table->string('action_es')->nullable();
            $table->string('action_fr')->nullable();
            $table->string('value_old')->nullable();
            $table->string('value_new')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_auditories');
    }
}
