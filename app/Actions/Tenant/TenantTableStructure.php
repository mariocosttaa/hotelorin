<?php

namespace App\Actions\Tenant;

class TenantTableStructure
{
    public static function getMigrations(): array
    {
        return [
            \Database\Migrations\Tenant\_LineTable::class,
            \Database\Migrations\Tenant\CreateClientTable::class,
            \Database\Migrations\Tenant\CreateAuditoryTable::class,
            \Database\Migrations\Tenant\CreatePermissionsTable::class,
            \Database\Migrations\Tenant\CreatePermissionUserTable::class,
            \Database\Migrations\Tenant\CreatePresenceActivityTable::class,
            \Database\Migrations\Tenant\CreateSectorTable::class,
            \Database\Migrations\Tenant\CreateRankTable::class,
            \Database\Migrations\Tenant\CreateAttachmentTable::class,
            \Database\Migrations\Tenant\CreateRoomTypeTable::class,
            \Database\Migrations\Tenant\CreateRoomTable::class,
            \Database\Migrations\Tenant\CreateComoditeTable::class,
            \Database\Migrations\Tenant\CreateRoomComoditesTable::class,
            \Database\Migrations\Tenant\CreateRoomGalleryTable::class,
            \Database\Migrations\Tenant\CreateRoomPriceTable::class,
            \Database\Migrations\Tenant\CreateBookingTable::class,
            \Database\Migrations\Tenant\CreateBookingPeopleTable::class,
            \Database\Migrations\Tenant\CreateBookingInvoceTable::class,
            \Database\Migrations\Tenant\CreateBookingPaymentTable::class,
            \Database\Migrations\Tenant\CreateSettingTable::class,
        ];
    }
}
