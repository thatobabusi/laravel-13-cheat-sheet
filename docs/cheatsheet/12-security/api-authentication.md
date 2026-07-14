# API Authentication

## Laravel Sanctum

### Install Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Configure Sanctum
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ',' . parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),

'guard' => env('SANCTUM_GUARD', 'sanctum'),
```

### Issue API Tokens
```php
// Create token
$token = $user->createToken('API Token')->plainTextToken;

// Multiple tokens
$token = $user->createToken('app-token')->plainTextToken;
$token2 = $user->createToken('mobile-token')->plainTextToken;

// Token with abilities
$token = $user->createToken('app-token', ['read', 'create'])->plainTextToken;
```

### Use API Tokens
```javascript
// Send token in header
fetch('/api/user', {
    headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    }
})
```

### Protect Routes
```php
// Route group with Sanctum guard
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Check abilities
    Route::get('/posts', function (Request $request) {
        if ($request->user()->tokenCan('read')) {
            // Return posts
        }
    });
});
```

## Laravel Passport

### Install Passport
```bash
composer require laravel/passport
php artisan passport:install
```

### Grant Types

#### Authorization Code Grant
```php
// User grants permission
Route::get('/authorize', [AuthorizationController::class, 'authorize']);

// Receive authorization code
// Exchange code for token
```

#### Password Grant
```php
// User credentials exchange for token
POST /oauth/token
{
    "grant_type": "password",
    "client_id": "1",
    "client_secret": "secret",
    "username": "user@example.com",
    "password": "password"
}
```

#### Client Credentials
```php
// Machine-to-machine authentication
POST /oauth/token
{
    "grant_type": "client_credentials",
    "client_id": "1",
    "client_secret": "secret",
    "scope": "read"
}
```

### Protect Routes
```php
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

## Token Scopes

### Define Scopes
```php
// app/Providers/AuthServiceProvider.php
use Laravel\Passport\Passport;

Passport::tokensCan([
    'read' => 'Read posts',
    'create' => 'Create posts',
    'update' => 'Update posts',
    'delete' => 'Delete posts',
]);
```

### Check Scopes
```php
Route::post('/posts', function (Request $request) {
    if ($request->user()->tokenCan('create')) {
        // Create post
    }
})->middleware('auth:api');
```

## JWT Authentication

### Install Package
```bash
composer require tymon/jwt-auth
php artisan jwt:secret
```

### Configure JWT
```php
// config/jwt.php
'secret' => env('JWT_SECRET'),
'ttl' => env('JWT_TTL', 60), // minutes
'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),
'algo' => env('JWT_ALGO', 'HS256'),
```

### Issue JWT Token
```php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $token = auth('api')->attempt($credentials);
    
    if (!$token) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    return response()->json(['token' => $token]);
}
```

### Use JWT Token
```javascript
// Include in header
fetch('/api/protected', {
    headers: {
        'Authorization': 'Bearer ' + token,
    }
})
```

### Refresh Token
```php
Route::post('/refresh', function (Request $request) {
    $token = auth('api')->refresh();
    return response()->json(['token' => $token]);
})->middleware('auth:api');
```

## OAuth 2.0 Best Practices

### Token Expiration
```php
// Short-lived access tokens (15 minutes)
Passport::accessTokensExpireIn(now()->addMinutes(15));

// Long-lived refresh tokens (1 year)
Passport::refreshTokensExpireIn(now()->addYear());
```

### Revoke Tokens
```php
// Logout - revoke token
Route::post('/logout', function (Request $request) {
    $request->user()->token()->revoke();
    return response()->json(['message' => 'Logged out']);
})->middleware('auth:api');
```

### PKCE (Proof Key for Code Exchange)
```php
// More secure for public clients (SPAs, mobile)
Passport::enableImplicitGrant();
Passport::withoutScopedTokens();
```

## API Rate Limiting

### Throttle API Requests
```php
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
});

// Dynamic rate limiting
Route::middleware('throttle:api')->group(function () {
    // Uses REDIS for distributed rate limiting
});
```

## See Also
- [[csrf-xss-prevention]]
- [[authentication-authorization]]
- [[rate-limiting-throttling]]
