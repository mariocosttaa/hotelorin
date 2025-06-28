<?php

namespace App\Http\Resources\Tenant;

use App\Actions\General\EasyHashAction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => EasyHashAction::encode(valueToBeEncode: $this->id, type: 'setting-id'),
            // logos and Icons
            'logo_light' => $this->logo_light,
            'logo_dark' => $this->logo_dark,
            'favicon' => $this->favicon,

            // Contact and Social
            'email' => $this->email,
            'address' => $this->address,
            'phone_code' => $this->phone_code,
            'phone' => $this->phone,
            'whatsapp_number_code' => $this->whatsapp_number_code,
            'whatsapp_number' => $this->whatsapp_number,
            'facebook' => $this->facebook,
            'instagram' => $this->instagram,

            // customization
            'template' => $this->template,
            'theme_color' => $this->theme_color,

            // language
            'multi_language' => $this->multi_language,
            'default_language' => $this->default_language,

            // currency
            'multi_currency' => $this->multi_currency,
            'default_currency_code' => $this->default_currency_code,

            // bookings
            'online_booking' => $this->online_booking,
            'online_booking_payment' => $this->online_booking_payment,
            'online_booking_require_payment' => $this->online_booking_require_payment,
            'online_booking_auto_confirm' => $this->online_booking_auto_confirm,

            // checkIn and checkOut
            'default_check_in' => $this->default_check_in,
            'default_check_out' => $this->default_check_out,

            // Modules
            'module_presence_activities' => $this->module_presence_activities,
        ];
    }
}
