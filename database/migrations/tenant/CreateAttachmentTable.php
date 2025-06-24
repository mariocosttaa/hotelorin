<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttachmentTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_attachments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('mime_type', ['image', 'video', 'audio', 'document', 'other']);
            $table->string('internal_path');
            $table->string('public_url');
            $table->integer('size'); //in bytes
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_attachments');
    }
}
