# Tenant File Management System

This document describes the logic and usage of the multi-tenant file management system implemented in the project. It covers the Action, Controller, Routes, and Middleware for handling public and private file storage and access.

---

## 1. TenantFileAction (app/Actions/Tenant/TenantFileAction.php)

Handles saving, retrieving, deleting, and generating URLs for tenant files.

### Methods
- **save($tenantId, UploadedFile $file, bool $isPublic = false, string $path = null, string $fileName = null, string $extension = null): string**
  - Saves a file for a tenant in either public or private storage.
  - Returns a URL to access the file via a controller route.
  - Example:
    ```php
    $url = TenantFileAction::save($tenantId, $file, true, 'gallery/2024/', 'my-photo', 'jpg');
    ```
- **get($tenantId, string $filePath, bool $isPublic = false): ?string**
  - Retrieves the file content (for internal use).
- **delete($tenantId, string $filePath, bool $isPublic = false): bool**
  - Deletes a file from storage.
- **show($tenantId, string $filePath, bool $isPublic = false): string**
  - Returns a URL to access the file via the appropriate controller route.

---

## 2. TenantFileController (app/Http/Controllers/Tenant/TenantFileController.php)

Serves files to users via HTTP routes.

### Methods
- **showPublic(Request $request, $tenantId, $filePath)**
  - Serves public files (no authentication required).
  - Returns the file with appropriate headers.
- **showPrivate(Request $request, $tenantId, $filePath)**
  - Serves private files (requires authentication and tenant access).
  - Returns the file with appropriate headers.
  - Access is protected by middleware.

---

## 3. Routes

Add the following routes to your `routes/web.php` or `routes/PanelRoutes.php`:

```php
use App\Http\Controllers\Tenant\TenantFileController;
use App\Http\Middleware\TenantAuthPrivateFiles;

// Public file access (no auth)
Route::get('/public/tenant/{tenantId}/gallery/{filePath}', [TenantFileController::class, 'showPublic'])
    ->where('filePath', '.*')
    ->name('tenant.gallery.public.show');

// Private file access (requires auth and tenant check)
Route::get('/private/tenant/{tenantId}/gallery/{filePath}', [TenantFileController::class, 'showPrivate'])
    ->middleware(['auth', TenantAuthPrivateFiles::class])
    ->where('filePath', '.*')
    ->name('tenant.gallery.private.show');
```

---

## 4. Middleware: TenantAuthPrivateFiles (app/Http/Middleware/TenantAuthPrivateFiles.php)

Ensures that only authenticated users whose `tenant_id` matches the route parameter can access private tenant files.

### Logic
- Checks if the user is authenticated.
- Checks if the user's `tenant_id` matches the `tenantId` route parameter.
- Aborts with 403 if not authorized.

### Example
```php
public function handle(Request $request, Closure $next)
{
    $tenantId = $request->route('tenantId');
    $user = $request->user();
    if (!$user || $user->tenant_id != $tenantId) {
        abort(403, 'Unauthorized access to tenant files.');
    }
    return $next($request);
}
```

---

## 5. Usage Example

**Saving a file:**
```php
$url = TenantFileAction::save($tenantId, $file, true, 'gallery/2024/', 'my-photo', 'jpg');
```

**Deleting a file:**
```php
TenantFileAction::delete($tenantId, 'gallery/2024/my-photo.jpg', true);
```

**Getting a file URL:**
```php
$url = TenantFileAction::show($tenantId, 'gallery/2024/my-photo.jpg', true);
```

**Accessing a file in the browser:**
- Public: `/public/tenant/{tenantId}/gallery/gallery/2024/my-photo.jpg`
- Private: `/private/tenant/{tenantId}/gallery/gallery/2024/my-photo.jpg` (requires login and tenant access)

---

## 6. Notes
- No need to register the middleware in Kernel.php if you use class-based assignment in routes.
- You can expand the middleware for more complex tenant access logic.
- This system does not require `php artisan storage:link` for public files, as all files are served via controller routes. 
