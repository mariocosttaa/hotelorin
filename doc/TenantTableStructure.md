# Centralized Tenant Table Structure

## Overview

The tenant table structure for HotelOrin is now defined in a single place: `app/Actions/Tenant/TenantTableStructure.php`. This class provides a single source of truth for the order and list of all tables (migrations) that make up a tenant's database schema.

## Why Centralize?
- **Consistency:** All commands and actions use the same table order and set.
- **Maintainability:** Add, remove, or reorder tables in one place.
- **Less Duplication:** No more copy-pasting or risk of mismatched table lists.

## Where is it?
- **File:** `app/Actions/Tenant/TenantTableStructure.php`
- **Method:** `TenantTableStructure::getMigrations()`

## Example Content
```php
class TenantTableStructure
{
    public static function getMigrations(): array
    {
        return [
            \Database\Migrations\Tenant\_LineTable::class,
            \Database\Migrations\Tenant\CreateClientTable::class,
            // ... more migrations ...
            \Database\Migrations\Tenant\CreateSettingTable::class,
        ];
    }
}
```

## How to Use

### In Commands (Migrate/Destroy)
```php
use App\Actions\Tenant\TenantTableStructure;

// For creation
foreach (TenantTableStructure::getMigrations() as $migrationClass) {
    (new $migrationClass($tenantId))->up();
}

// For destruction (rollback)
foreach (array_reverse(TenantTableStructure::getMigrations()) as $migrationClass) {
    (new $migrationClass($tenantId))->down();
}
```

### In Actions
```php
foreach (TenantTableStructure::getMigrations() as $migrationClass) {
    (new $migrationClass($tenantId))->up();
}
```

## How to Update
- To add/remove/reorder tables, edit the array in `TenantTableStructure::getMigrations()`.
- All commands and actions will automatically use the new structure.

## Benefits
- **Single source of truth** for tenant DB structure.
- **Easy to update** and maintain.
- **Reduces bugs** from inconsistent table creation/rollback.

---

**HotelOrin Centralized Tenant Table Structure System** 
