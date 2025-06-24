# Tenant Seeding Workflow

This document explains how to seed default data (such as ranks and sectors) for a specific tenant in the HotelOrin system.

## Overview

You can seed all default tenant data at once, or run a specific seeder (e.g., only ranks or only sectors) for a given tenant. This is useful for initializing new tenants or updating specific data sets.

## Usage

### 1. Seed All Default Data for a Tenant

This will run all default seeders (e.g., ranks, sectors, and any others added to the default seeder):

```
php artisan tenant:seed {tenant_id}
```

Replace `{tenant_id}` with the actual tenant's ID.

### 2. Seed Only a Specific Seeder for a Tenant

You can run a specific seeder by passing its name as a second argument:

- **Ranks only:**
  ```
  php artisan tenant:seed {tenant_id} rank
  ```
- **Sectors only:**
  ```
  php artisan tenant:seed {tenant_id} sector
  ```

> You can add more seeders in `database/seeders/Tenant/` and update the command logic to support them.

## Adding More Seeders

1. Create a new seeder in `database/seeders/Tenant/` (e.g., `PermissionSeeder.php`).
2. Add its logic to the command in `app/Console/Commands/Tenant/SeedTenantDefaults.php`.
3. Optionally, add it to the default seeder (`_TenantDefaultSeeder.php`) to include it in the full seeding process.

## Notes
- The command will automatically set up the correct tenant context if you add your tenant DB connection logic.
- The workflow is modular and easy to extend for future entities.

---

**HotelOrin Tenant Seeding System** 
