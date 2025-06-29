<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname')->nullable();
            $table->string('email')->unique();
            $table->enum('language', ['pt', 'en', 'es', 'fr'])->default('en');
            $table->boolean('login_google')->default(false);
            $table->date('birthday')->nullable();
            $table->foreignId('country_id')->constrained('countries')->onDelete('cascade')->name('users_country_id_foreign');
            $table->string('image')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // user_tenant
        Schema::create('user_tenant', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->index()->name('user_tenant_user_id_foreign');
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade')->index()->name('user_tenant_tenant_id_foreign');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        // user_rank
        Schema::create('user_rank', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->index('user_rank_user_id_index');
            $table->foreignId('rank_id');
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade')->index('user_rank_tenant_id_index');
            $table->timestamps();
        });

        // user_sectors
        Schema::create('user_sector', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->index('user_sectors_user_id_index');
            $table->foreignId('sector_id');
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade')->index('user_sectors_tenant_id_index');
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('user_tenant');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
