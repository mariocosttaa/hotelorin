<?php

namespace App\Http\Resources\Tenant;

use App\Actions\General\EasyHashAction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => EasyHashAction::encode($this->id, 'room-type-id'),
            'name' => $this->name,
            'description' => $this->description,
            'slug' => $this->slug,

            // Raw data for editing
            'name_pt' => $this->name_pt,
            'name_en' => $this->name_en,
            'name_es' => $this->name_es,
            'name_fr' => $this->name_fr,
            'description_pt' => $this->description_pt,
            'description_en' => $this->description_en,
            'description_es' => $this->description_es,
            'description_fr' => $this->description_fr,
            'slug_pt' => $this->slug_pt,
            'slug_en' => $this->slug_en,
            'slug_es' => $this->slug_es,
            'slug_fr' => $this->slug_fr,

            // Type-specific data (can be inherited by rooms)
            'comodites' => $this->whenLoaded('comodites', function () {
                return \App\Http\Resources\Tenant\RoomComoditeResource::collection($this->comodites)->resolve();
            }),

            'galleries' => $this->whenLoaded('galleries', function () {
                return \App\Http\Resources\Tenant\RoomGalleryResource::collection($this->galleries)->resolve();
            }),

            'prices' => $this->whenLoaded('prices', function () {
                return \App\Http\Resources\Tenant\RoomPriceResource::collection($this->prices)->resolve();
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
