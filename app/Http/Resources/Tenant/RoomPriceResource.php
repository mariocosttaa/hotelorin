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
            'room_id' => EasyHashAction::encode($this->room_id, 'room-id'),
            'price' => $this->price,
            'price_ilustrative' => $this->price_ilustrative,
            'currency_code' => $this->currency_code,
            'status' => $this->status,

            //relations
            'room' => $this->whenLoaded('room', function () {
                return RoomResource::make($this->room)->toArray(request());
            }),
            'currency' => $this->whenLoaded('currency', function () {
                return CurrencyResource::make($this->currency)->toArray(request());
            }),
        ];
    }
}
