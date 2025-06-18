<?php

namespace Database\Migrations\Tenant;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

abstract class _TenantHelperMigration extends Migration
{
    /**
     * The database connection that should be used by the migration.
     *
     * @var string
     */
    protected $connection = 'tenant';

    protected int $tenantId;

    public function __construct(int $tenantId)
    {
        if ($tenantId <= 0) {
            throw new \InvalidArgumentException('Prefix of Tenant ID must be a positive integer.');
        }
        $this->tenantId = $tenantId;
    }

    protected function getTableName(string $tableName): string
    {
        return $this->tenantId . '_' . $tableName;
    }

    abstract public function up();

    abstract public function down();
}
