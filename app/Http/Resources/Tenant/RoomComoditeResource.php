<?php

namespace App\Http\Resources\Tenant;

use App\Actions\General\EasyHashAction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomComoditeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => EasyHashAction::encode($this->id, 'room-comodite-id'),
            'room_type_id' => $this->room_type_id ? EasyHashAction::encode($this->room_type_id, 'room-type-id') : null,
            'room_id' => $this->room_id ? EasyHashAction::encode($this->room_id, 'room-id') : null,

            //relations
            'comodite' => $this->whenLoaded('comodite', function () {
                return ComoditeResource::make($this->comodite)->toArray(request());
            }),
            'room_type' => $this->whenLoaded('room_type', function () {
                return RoomTypeResource::make($this->room_type)->toArray(request());
            }),
            'room' => $this->whenLoaded('room', function () {
                return RoomResource::make($this->room)->toArray(request());
            }),
        ];
    }
}
