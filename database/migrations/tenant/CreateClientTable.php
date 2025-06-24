<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_clients', function (Blueprint $table) {
            $table->id();
            //Person
            $table->string('name');
            $table->string('surname');
            $table->string('email')->nullable();
            //Phone
            $table->string('phone_code')->nullable();
            $table->string('phone')->nullable();
            $table->string('phone_code_alternative')->nullable();
            $table->string('phone_alternative')->nullable();
            //Document
            $table->string('document')->nullable();
            $table->string('document_type')->nullable();
            $table->string('document_country_code')->nullable();

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_clients');
    }
}
