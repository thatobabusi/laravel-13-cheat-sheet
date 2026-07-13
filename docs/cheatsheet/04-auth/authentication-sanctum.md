# Authentication & Sanctum

> User authentication with sessions or Sanctum tokens for APIs.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Authentication & Authorization

## Auth Checks

```php
Auth::check();
Auth::guest();
Auth::id();
Auth::user();                              // current user model
```

## Login

```php
Auth::attempt(['email' => $e, 'password' => $p]);
Auth::attempt(['email' => $e, 'password' => $p], $remember);
Auth::attemptWhen(['email' => $e, 'password' => $p], fn($u) => $u->is_active);
Auth::login($user);
Auth::login($user, remember: true);
Auth::loginUsingId(1);
Auth::once(['email' => $e, 'password' => $p]);  // single-request auth
```

## Logout

```php
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();
```

## Guards

```php
Auth::guard('api')->user();
Auth::guard('admin')->attempt([...]);
```

## Sanctum — API Tokens

Install Sanctum:

```bash
php artisan install:api
```

Setup in model:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable 
{ 
    use HasApiTokens; 
}
```

### Create & Manage Tokens

```php
$user->createToken('token-name')->plainTextToken;
$user->createToken('token-name', ['posts:read','posts:write'])->plainTextToken;
$user->tokens()->delete();                 // revoke all tokens
$request->user()->currentAccessToken()->delete();  // revoke current
```

### Token Abilities

```php
$request->user()->tokenCan('posts:write');
```

## Sanctum SPA

Cookie-based authentication for SPAs:

```php
// routes/api.php
Auth::routes();
// Sanctum routes auto-added
```

## Route Protection

```php
Route::middleware('auth:sanctum')->group(function () { 
    // Protected routes
});

Route::middleware('auth')->group(function () { 
    // Session-based routes
});
```

---

**See Also:** [[authorization]] | [[middleware]]
