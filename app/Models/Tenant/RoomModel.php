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

    public function getOverviewNameAttribute(): string
    {
        $lang = app()->getLocale();
        return $this->{"overview_name_$lang"} ?? $this->overview_name_en ?? $this->overview_name_pt ?? $this->overview_name_es ?? $this->overview_name_fr;
    }

    public function getOverviewDescriptionAttribute(): string
    {
        $lang = app()->getLocale();
        return $this->{"overview_description_$lang"} ?? $this->overview_description_en ?? $this->overview_description_pt ?? $this->overview_description_es ?? $this->overview_description_fr;
    }

    public function getOverviewSlugAttribute(): string
    {
        $lang = app()->getLocale();
        return $this->{"overview_slug_$lang"} ?? $this->overview_slug_en ?? $this->overview_slug_pt ?? $this->overview_slug_es ?? $this->overview_slug_fr;
    }

    public function getNameAttribute(): string
    {
        if (!$this->type) {
            return "Room #{$this->id}";
        }

        $lang = app()->getLocale();
        $nameField = "name_$lang";

        // Try to get name from room type based on current locale
        if (isset($this->type->$nameField) && !empty($this->type->$nameField)) {
            return $this->type->$nameField;
        }

        // Fallback to other languages in order of preference
        $fallbackLanguages = ['en', 'pt', 'es', 'fr'];
        foreach ($fallbackLanguages as $fallbackLang) {
            $fallbackField = "name_$fallbackLang";
            if (isset($this->type->$fallbackField) && !empty($this->type->$fallbackField)) {
                return $this->type->$fallbackField;
            }
        }

        return "Room #{$this->id}";
    }

    public function getDescriptionAttribute(): string
    {
        if (!$this->type) {
            return '';
        }

        $lang = app()->getLocale();
        $descField = "description_$lang";

        // Try to get description from room type based on current locale
        if (isset($this->type->$descField) && !empty($this->type->$descField)) {
            return $this->type->$descField;
        }

        // Fallback to other languages in order of preference
        $fallbackLanguages = ['en', 'pt', 'es', 'fr'];
        foreach ($fallbackLanguages as $fallbackLang) {
            $fallbackField = "description_$fallbackLang";
            if (isset($this->type->$fallbackField) && !empty($this->type->$fallbackField)) {
                return $this->type->$fallbackField;
            }
        }

        return '';
    }

    public function comodites(): HasMany
    {
        return $this->hasMany(RoomComoditeModel::class, 'room_id');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(RoomTypeModel::class, 'room_type_id');
    }

    public function galleries(): HasMany
    {
        return $this->hasMany(RoomGalleryModel::class, 'room_id');
    }

    public function prices(): HasMany
    {
        return $this->hasMany(RoomPriceModel::class, 'room_id');
    }

}
