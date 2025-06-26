<?php

namespace App\Models\Manager;

use App\Models\Helpers\ManagerModelHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Manager\SubscriptionPriceModel;
use App\Models\Manager\SubscriptionInvoiceModel;
use App\Models\Manager\SubscriptionFeatureModel;

class SubscriptionModel extends ManagerModelHelper
{
    use HasFactory;

    protected $table = 'subscriptions';

    protected $fillable = [
        'name',
        'slug',
        'description_en',
        'description_es',
        'description_fr',
        'description_pt',
        'level',
        'is_free',
        'mandatory_period',
        'status',
    ];

    protected $casts = [
        'level' => 'integer',
        'is_free' => 'boolean',
        'status' => 'boolean',
    ];

    protected $enumCasts = [
        'mandatory_period' => ['month', 'quarter', 'year'],
    ];

    public $timestamps = true;

    public function getDescriptionAttribute() {
        $lang = app()->getLocale();
        return $this->{"description_$lang"} ?? $this->description_en ?? $this->description_pt ?? $this->description_es ?? $this->description_fr;
    }

    public function prices()
    {
        return $this->hasMany(SubscriptionPriceModel::class, 'subscription_id');
    }

    public function features()
    {
        return $this->hasMany(SubscriptionFeatureModel::class, 'subscription_id');
    }

    public function invoices()
    {
        return $this->hasMany(SubscriptionInvoiceModel::class, 'subscription_id');
    }

}
