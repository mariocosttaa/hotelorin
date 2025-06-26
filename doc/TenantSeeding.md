# Tenant Seeding Workflow

This document explains how to seed default data (such as settings, ranks, sectors, and amenities) for a specific tenant in the HotelOrin system.

## Overview

You can seed all default tenant data at once, or run a specific seeder (e.g., only settings, ranks, or sectors) for a given tenant. This is useful for initializing new tenants or updating specific data sets.

## Usage

### 1. Seed All Default Data for a Tenant

This will run all default seeders (settings, ranks, sectors, amenities, and any others added to the default seeder):

```
php artisan tenant:seed {tenant_id}
```

Replace `{tenant_id}` with the actual tenant's ID.

### 2. Seed Only a Specific Seeder for a Tenant

You can run a specific seeder by passing its name as a second argument:

- **Settings only:**
  ```
  php artisan tenant:seed {tenant_id} setting
  ```
- **Ranks only:**
  ```
  php artisan tenant:seed {tenant_id} rank
  ```
- **Sectors only:**
  ```
  php artisan tenant:seed {tenant_id} sector
  ```
- **Amenities only:**
  ```
  php artisan tenant:seed {tenant_id} comodite
  ```

## Default Seeders Order

The default seeders run in this order:

1. **SettingSeeder** - Creates default tenant settings (language, currency, booking preferences, etc.)
2. **RankSeeder** - Creates default hotel ranks/ratings
3. **SectorSeeder** - Creates default hotel sectors/areas
4. **ComoditeSeeder** - Creates default amenities/features

## Settings Seeder Details

The `SettingSeeder` creates default configuration for new tenants with the following defaults:

### Language & Currency
- **Default Language**: Portuguese (pt)
- **Multi-language**: Enabled
- **Default Currency**: Brazilian Real (BRL)
- **Multi-currency**: Enabled

### Booking Settings
- **Online Booking**: Enabled
- **Payment Required**: Disabled (optional)
- **Auto-confirm**: Disabled
- **Check-in Time**: 14:00 (2:00 PM)
- **Check-out Time**: 12:00 (12:00 PM)

### Contact & Branding
- **Phone Code**: +55 (Brazil)
- **WhatsApp Code**: +55 (Brazil)
- **Template**: 'default'
- **Theme Color**: #3B82F6 (Blue)

## Adding More Seeders

1. Create a new seeder in `database/seeders/Tenant/` (e.g., `PermissionSeeder.php`).
2. Add its logic to the command in `app/Console/Commands/Tenant/SeedTenantDefaults.php`.
3. Optionally, add it to the default seeder (`_TenantDefaultSeeder.php`) to include it in the full seeding process.

## Notes
- The command will automatically set up the correct tenant context if you add your tenant DB connection logic.
- The workflow is modular and easy to extend for future entities.
- Settings are created first as other seeders might depend on tenant configuration.

---

**HotelOrin Tenant Seeding System** 
