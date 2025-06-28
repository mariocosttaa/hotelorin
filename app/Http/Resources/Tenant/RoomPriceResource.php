<?php

namespace App\Http\Resources\Tenant;

use App\Actions\General\EasyHashAction;
use App\Http\Resources\Manager\CurrencyResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomPriceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => EasyHashAction::encode($this->id, 'room-price-id'),
            'room_id' => $this->room_id ? EasyHashAction::encode($this->room_id, 'room-id') : null,
            'room_type_id' => $this->room_type_id ? EasyHashAction::encode($this->room_type_id, 'room-type-id') : null,
            'use_type_price_in_room' => (bool) $this->use_type_price_in_room,
            'price' => $this->price,
            'price_ilustrative' => $this->price_ilustrative,
            'currency_code' => $this->currency_code,
            'status' => $this->status,

            // Formatted prices
            'price_formatted' => $this->price_formatted,
            'price_ilustrative_formatted' => $this->price_ilustrative_formatted,

            //relations
            'room' => $this->whenLoaded('room', function () {
                return \App\Http\Resources\Tenant\RoomResource::make($this->room)->toArray(request());
            }),
            'room_type' => $this->whenLoaded('roomType', function () {
                return \App\Http\Resources\Tenant\RoomTypeResource::make($this->roomType)->toArray(request());
            }),
            'currency' => $this->whenLoaded('currency', function () {
                return \App\Http\Resources\Manager\CurrencyResource::make($this->currency)->toArray(request());
            }),
        ];
    }
}
