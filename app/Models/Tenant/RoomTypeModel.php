<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Helpers\TenantModelHelper;

class RoomTypeModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'room_types';
    protected $baseTable = 'room_types';

    protected $fillable = [
        'name_pt',
        'name_en',
        'name_es',
        'name_fr',
        'description_pt',
        'description_en',
        'description_es',
        'description_fr',
        'slug_pt',
        'slug_en',
        'slug_es',
        'slug_fr',
    ];

    public $timestamps = true;

    public function getNameAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->name_en ?? $this->name_pt ?? $this->name_es ?? $this->name_fr;
            case 'es':
                return $this->name_es ?? $this->name_pt ?? $this->name_en ?? $this->name_fr;
            case 'fr':
                return $this->name_fr ?? $this->name_pt ?? $this->name_en ?? $this->name_es;
            case 'pt':
            default:
                return $this->name_en ?? $this->name_pt ?? $this->name_es ?? $this->name_fr;
        }
    }

    public function getDescriptionAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->description_en ?? $this->description_pt ?? $this->description_es ?? $this->description_fr;
            case 'es':
                return $this->description_es ?? $this->description_pt ?? $this->description_en ?? $this->description_fr;
            case 'fr':
                return $this->description_fr ?? $this->description_pt ?? $this->description_en ?? $this->description_es;
            case 'pt':
            default:
                return $this->description_en ?? $this->description_pt ?? $this->description_es ?? $this->description_fr;
        }
    }

    public function getSlugAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->slug_en ?? $this->slug_pt ?? $this->slug_es ?? $this->slug_fr;
            case 'es':
                return $this->slug_es ?? $this->slug_pt ?? $this->slug_en ?? $this->slug_fr;
            case 'fr':
                return $this->slug_fr ?? $this->slug_pt ?? $this->slug_en ?? $this->slug_es;
            case 'pt':
            default:
                return $this->slug_en ?? $this->slug_pt ?? $this->slug_es ?? $this->slug_fr;
        }
    }

}
