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
            'id' => $this->id,
            'room_type_id' => $this->room_type_id,
            'max_adults' => $this->max_adults,
            'max_children' => $this->max_children,
            'max_infants' => $this->max_infants,
            'max_pets' => $this->max_pets,
            'name' => $this->name,
            'description' => $this->description,

            //relations
            'room_type' => $this->whenLoaded('type', function () {
                return [
                    'id' => $this->type->id,
                    'name_pt' => $this->type->name_pt,
                    'name_en' => $this->type->name_en,
                    'name_es' => $this->type->name_es,
                    'name_fr' => $this->type->name_fr,
                    'description_pt' => $this->type->description_pt,
                    'description_en' => $this->type->description_en,
                    'description_es' => $this->type->description_es,
                    'description_fr' => $this->type->description_fr,
                ];
            }),

            'comodites' => $this->whenLoaded('comodites', function () {
                return $this->comodites->map(function ($comodite) {
                    return [
                        'id' => $comodite->comodite->id,
                        'name' => $comodite->comodite->name,
                        'description' => $comodite->comodite->description,
                        'icon' => $comodite->comodite->icon,
                    ];
                });
            }),

            'galleries' => $this->whenLoaded('galleries', function () {
                return $this->galleries->map(function ($gallery) {
                    return [
                        'id' => $gallery->id,
                        'src' => $gallery->src,
                        'type' => $gallery->type,
                    ];
                });
            }),

            'prices' => $this->whenLoaded('prices', function () {
                return $this->prices->map(function ($price) {
                    return [
                        'currency_code' => $price->currency_code,
                        'price' => $price->price,
                        'price_formatted' => $price->price_formatted,
                        'price_ilustrative' => $price->price_ilustrative,
                        'price_ilustrative_formatted' => $price->price_ilustrative_formatted,
                        'status' => $price->status,
                    ];
                });
            }),
        ];
    }
}
