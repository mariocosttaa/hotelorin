<?php

namespace App\Models\Manager;

use App\Models\Helpers\ManagerModelHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionFeatureModel extends ManagerModelHelper
{
    use HasFactory;

    protected $table = 'subscription_features';

    protected $fillable = [
        'type',
        'subscription_id',
        'order',
        'name_en',
        'name_es',
        'name_fr',
        'name_pt',
        'status'
    ];

    protected $casts = [
        'order' => 'integer',
        'status' => 'boolean',
    ];

    public $timestamps = true;

    public function getNameAttribute() {
        $lang = app()->getLocale();
        return $this->{"name_$lang"} ?? $this->name_en ?? $this->name_pt ?? $this->name_es ?? $this->name_fr;
    }
}
