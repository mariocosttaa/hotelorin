<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingTable extends _TenantHelperMigration
{
    protected $connection = 'tenants';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection($this->connection)->create($this->tenantId.'_settings', function (Blueprint $table) {
            $table->id();

            //logos and Icons
            $table->string('logo_light')->nullable();
            $table->string('logo_dark')->nullable();
            $table->string('favicon')->nullable();

            //Contact and Social
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('phone_code')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp_number_code')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();

            //customization
            $table->string('template')->default('default');
            $table->string('theme_color')->default('#00bfff');

            //currency
            $table->boolean('multi_currency')->default(true);
            $table->string('default_currency_code');

            //language
            $table->boolean('multi_language')->default(true);
            $table->enum('default_language', ['pt', 'en', 'es', 'fr'])->default('pt');

            //bookings
            $table->boolean('online_booking')->default(true);
            $table->boolean('online_booking_payment')->default(true);
            $table->boolean('online_booking_require_payment')->default(true);
            $table->boolean('online_booking_auto_confirm')->default(true);

            //checkIn and checkOut
            $table->time('default_check_in')->default('14:00:00');
            $table->time('default_check_out')->default('12:00:00');

            //Modules
            $table->boolean('module_presence_activities')->default(true);

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection($this->connection)->dropIfExists($this->tenantId.'_settings');
    }
}
