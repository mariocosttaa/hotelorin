<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Helpers\TenantModelHelper;

class AttachmentModel extends TenantModelHelper
{
    use HasFactory;
    protected $connection = 'tenants';
    protected $table = 'attachments';
    protected $baseTable = 'attachments';
    protected $fillable = [
        'name',
        'mime_type',
        'internal_path',
        'public_url',
        'size',
    ];

    protected $casts = [
        'mime_type' => 'string', //image, video, audio, document, other
        'internal_path' => 'string',
        'public_url' => 'string',
        'size' => 'integer', //in bytes
    ];

    public $timestamps = true;

}
