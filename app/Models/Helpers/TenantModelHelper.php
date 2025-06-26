<?php

namespace App\Models\Helpers;

use App\Actions\General\EasyHashAction;
use App\CustomCache\Auth\AuthCache;
use App\Models\Manager\UserModel;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

abstract class TenantModelHelper extends Model
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


        } else if (request()->tenantId && AuthCache::getUser()) {
            // Se o tenantId estiver presente na request e o usuário estiver autenticado, decodifica o tenantId

            $tenantIdHashed = request()->tenantId;
            $tenantId = EasyHashAction::decode($tenantIdHashed, 'tenant-id');
            config(['tenantId' => $tenantId]);

        } else {
            throw new Exception('Tenant Id not Defined');
        }

        // Ajusta o nome da tabela se houver tenantId e o prefixo ainda não estiver presente
        if ($tenantId && strpos($this->getTable(), $tenantId . '_') !== 0) {
            $this->setTable($tenantId . '_' . $this->baseTable);
        }

    }
}
