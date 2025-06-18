<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationTableExample extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_news', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('subject');
            $table->text('message');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::connection($this->connection)->create($this->tenantId.'_notam', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('subject');
            $table->text('message');
            $table->boolean('mandatory')->default(false);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::connection($this->connection)->create($this->tenantId.'_notam_users_opened', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreignId('notam_id')->constrained($this->tenantId.'_notam')->onDelete('cascade');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::connection($this->connection)->create($this->tenantId.'_notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('subject');
            $table->text('message');
            $table->enum('type', ['email', 'intra_email', 'sms']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_notifications');
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_notam_users_opened');
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_notam');
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_news');
    }
}
