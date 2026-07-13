# Middleware

> Middleware filters HTTP requests entering your application.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Core Framework

## Create Middleware

```bash
php artisan make:middleware EnsureTokenIsValid
```

## Basic Middleware

```php
// app/Http/Middleware/EnsureTokenIsValid.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->input('token') !== 'my-secret') {
            return redirect('/home');
        }
        return $next($request);           // pass to next middleware
    }
}
```

## After Middleware

Runs after response is sent:

```php
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);
    // do work after response...
    return $response;
}
```

## Middleware with Parameters

```php
public function handle(Request $request, Closure $next, string $role): Response
{
    if (!$request->user()->hasRole($role)) {
        abort(403);
    }
    return $next($request);
}

// Usage on route:
Route::get('/admin', ...)->middleware('role:admin');
```

## Register Middleware

### Alias in bootstrap/app.php

```php
$middleware->alias(['role' => CheckRole::class]);
```

## Apply to Routes

```php
// Single middleware
Route::get('/admin', ...)->middleware(EnsureTokenIsValid::class);

// Multiple middleware
Route::get('/admin', ...)->middleware(['auth', 'verified', 'role:admin']);

// Exclude middleware for specific routes
Route::get('/webhook', ...)->withoutMiddleware(VerifyCsrfToken::class);
```

---

**See Also:** [[routing]] | [[application-bootstrap]] | [[requests]]
