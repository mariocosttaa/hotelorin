<?php

namespace App\Http\Resources\Tenant;

use App\Actions\General\EasyHashAction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'number' => $this->number,
            'id' => EasyHashAction::encode($this->id, 'room-id'),
            'room_type_id' => $this->room_type_id ? EasyHashAction::encode($this->room_type_id, 'room-type-id') : null,

            // Basic room info
            'max_adults' => $this->max_adults,
            'max_children' => $this->max_children,
            'max_infants' => $this->max_infants,
            'max_pets' => $this->max_pets,

            // Name and description (inherited from room type if not set)
            'name' => $this->name,
            'description' => $this->description,

            // Raw data for editing (room-specific overrides)
            'overview_name_pt' => $this->overview_name_pt,
            'overview_name_en' => $this->overview_name_en,
            'overview_name_es' => $this->overview_name_es,
            'overview_name_fr' => $this->overview_name_fr,
            'overview_description_pt' => $this->overview_description_pt,
            'overview_description_en' => $this->overview_description_en,
            'overview_description_es' => $this->overview_description_es,
            'overview_description_fr' => $this->overview_description_fr,

            // Room type relationship
            'room_type' => $this->whenLoaded('roomType', function () {
                return RoomTypeResource::make($this->roomType)->resolve();
            }),

            // Full data (own + inherited) for display
            'galleries' => $this->when(true, function () {
                return RoomGalleryResource::collection($this->getFullGallery())->resolve();
            }),

            'comodites' => $this->when(true, function () {
                return RoomComoditeResource::collection($this->getFullComodites())->resolve();
            }),

            'prices' => $this->when(true, function () {
                return RoomPriceResource::collection($this->getFullPrices())->resolve();
            }),

            // Room-specific data only (for editing)
            'own_galleries' => $this->whenLoaded('galleries', function () {
                return RoomGalleryResource::collection($this->galleries)->resolve();
            }),

            'own_comodites' => $this->whenLoaded('comodites', function () {
                return RoomComoditeResource::collection($this->comodites)->resolve();
            }),

            'own_prices' => $this->whenLoaded('prices', function () {
                return RoomPriceResource::collection($this->prices)->resolve();
            }),

            // Inherited data from room type
            'inherited_galleries' => $this->when(true, function () {
                return RoomGalleryResource::collection($this->getTypeGalleries())->resolve();
            }),

            'inherited_comodites' => $this->when(true, function () {
                return RoomComoditeResource::collection($this->getTypeComodites())->resolve();
            }),

            'inherited_prices' => $this->when(true, function () {
                return RoomPriceResource::collection($this->getTypePrices())->resolve();
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
