<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'rooms';
    protected $baseTable = 'rooms';
    protected $fillable = [
        //OverWrite
        'overview_name_pt',
        'overview_name_en',
        'overview_name_es',
        'overview_name_fr',
        //OverWrite
        'overview_description_pt',
        'overview_description_en',
        'overview_description_es',
        'overview_description_fr',
        //OverWrite
        'overview_slug_pt',
        'overview_slug_en',
        'overview_slug_es',
        'overview_slug_fr',
        //Room
        'room_type_id',
        //Max Capacity
        'max_adults',
        'max_children',
        'max_infants',
        'max_pets',
    ];

    public $timestamps = true;

    public function roomComodites(): BelongsToMany
    {
        return $this->belongsToMany(RoomComoditeModel::class, 'room_id');
    }

    public function getOverviewNameAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->overview_name_en ?? $this->overview_name_pt ?? $this->overview_name_es ?? $this->overview_name_fr;
            case 'es':
                return $this->overview_name_es ?? $this->overview_name_pt ?? $this->overview_name_en ?? $this->overview_name_fr;
            case 'fr':
                return $this->overview_name_fr ?? $this->overview_name_pt ?? $this->overview_name_en ?? $this->overview_name_es;
            case 'pt':
            default:
                return $this->overview_name_en ?? $this->overview_name_pt ?? $this->overview_name_es ?? $this->overview_name_fr;
        }
    }

    public function getOverviewDescriptionAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->overview_description_en ?? $this->overview_description_pt ?? $this->overview_description_es ?? $this->overview_description_fr;
            case 'es':
                return $this->overview_description_es ?? $this->overview_description_pt ?? $this->overview_description_en ?? $this->overview_description_fr;
            case 'fr':
                return $this->overview_description_fr ?? $this->overview_description_pt ?? $this->overview_description_en ?? $this->overview_description_es;
            case 'pt':
            default:
                return $this->overview_description_en ?? $this->overview_description_pt ?? $this->overview_description_es ?? $this->overview_description_fr;
        }
    }

    public function getOverviewSlugAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->overview_slug_en ?? $this->overview_slug_pt ?? $this->overview_slug_es ?? $this->overview_slug_fr;
            case 'es':
                return $this->overview_slug_es ?? $this->overview_slug_pt ?? $this->overview_slug_en ?? $this->overview_slug_fr;
            case 'fr':
                return $this->overview_slug_fr ?? $this->overview_slug_pt ?? $this->overview_slug_en ?? $this->overview_slug_es;
            case 'pt':
            default:
                return $this->overview_slug_en ?? $this->overview_slug_pt ?? $this->overview_slug_es ?? $this->overview_slug_fr;
        }
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomTypeModel::class, 'room_type_id');
    }

}
