<?php

namespace App\Models\Tenant;

use App\Models\Helpers\TenantModelHelper;
use App\Models\Manager\UserModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditoryModel extends TenantModelHelper
{
    use HasFactory;

    protected $connection = 'tenants';
    protected $table = 'auditories';
    protected $baseTable = 'auditories';

    protected $fillable = [
        'type',
        'user_id',
        'action_en',
        'action_pt',
        'action_es',
        'action_fr',
        'value_old',
        'value_new',
    ];

    public $timestamps = true;

    public function getActionAttribute(): string
    {
        $lang = app()->getLocale();
        switch ($lang) {
            case 'en':
                return $this->action_en ?? $this->action_pt ?? $this->action_es ?? $this->action_fr;
            case 'es':
                return $this->action_es ?? $this->action_pt ?? $this->action_en ?? $this->action_fr;
            case 'fr':
                return $this->action_fr ?? $this->action_pt ?? $this->action_en ?? $this->action_es;
            case 'pt':
            default:
                return $this->action_en ?? $this->action_pt ?? $this->action_es ?? $this->action_fr;
        }
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'user_id')
            ->on('manager');
    }
}
