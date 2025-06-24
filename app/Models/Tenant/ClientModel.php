<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Helpers\TenantModelHelper;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'clients';
    protected $baseTable = 'clients';
    protected $fillable = [
        'name',
        'surname',
        'email',
        //Phone
        'phone_code',
        'phone',
        'phone_code_alternative',
        'phone_alternative',
        //Document
        'document',
        'document_type',
        'document_country_code',
    ];

    public $timestamps = true;

    public function phone_number(): string
    {
        return $this->phone_code . $this->phone;
    }

    public function phone_number_alternative(): string
    {
        return $this->phone_code_alternative . $this->phone_alternative;
    }

}
