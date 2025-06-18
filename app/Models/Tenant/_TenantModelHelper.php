<?php

namespace App\Models\Tenant;

use App\Models\Manager\UserModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

abstract class _TenantModelHelper extends Model
{
    protected $baseTable;

    public function __construct(array $attributes = [])
    {
        // Define o nome base da tabela se não estiver definido
        if (!isset($this->baseTable)) {
            $this->baseTable = $this->getTable();
        }

        // Chama o construtor da classe pai
        parent::__construct($attributes);

        // Determina o Id
        if (config('tenantId')) {
            $tenantId = config('tenantId');
        } elseif (Auth::check()) {
            $tenantId = Auth::user()->tenant_id;
        } else {
            $tenantId = null;
        }

        // Ajusta o nome da tabela se houver tenantId e o prefixo ainda não estiver presente
        if ($tenantId && strpos($this->getTable(), $tenantId . '_') !== 0) {
            $this->setTable($tenantId . '_' . $this->baseTable);
        }
    }
}
