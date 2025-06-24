<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionUserTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_permissions_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('permission_id');
            $table->bigInteger('user_id');
            //Permissions
            $table->boolean('access')->default(false);
            //Relations
            $table->foreign('permission_id')->references('id')->on($this->tenantId.'_permissions')->onDelete('cascade');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_permissions_user');
    }
}
