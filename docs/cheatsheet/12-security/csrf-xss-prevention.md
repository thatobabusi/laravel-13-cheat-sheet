# CSRF & XSS Prevention

## CSRF Token Handling

### Include Token in Forms
```html
<!-- Automatically included in Blade forms -->
<form method="POST" action="/posts">
    @csrf
    <input type="text" name="title">
    <button type="submit">Create Post</button>
</form>
```

### Manual Token in Forms
```php
<form method="POST">
    <input type="hidden" name="_token" value="{{ csrf_token() }}">
</form>
```

### Token in AJAX Requests
```javascript
// Get token from meta tag
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Include in fetch
fetch('/api/posts', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': token,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});
```

### Configure CSRF Middleware
```php
// app/Http/Middleware/VerifyCsrfToken.php
class VerifyCsrfToken extends Middleware
{
    protected $except = [
        'api/*', // Exclude API routes
        'webhook/*',
    ];
}
```

## XSS Prevention

### Escape Output (Blade Automatic)
```blade
{{-- Automatically escapes HTML --}}
<p>{{ $userInput }}</p>

{{-- Raw output (UNSAFE) --}}
<p>{!! $htmlContent !!}</p>

{{-- Escape explicitly if needed --}}
<p>{{ htmlspecialchars($text) }}</p>
```

### HTML Escape Function
```php
$safe = htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');
echo $safe;
```

### Content Security Policy
```php
// config/http.php
'middleware' => [
    // Add CSP header
    \Illuminate\Http\Middleware\Csp::class,
],

// app/Http/Middleware/SetCspHeaders.php
public function handle($request, Closure $next)
{
    return $next($request)
        ->header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'");
}
```

## Input Validation

### Validate User Input
```php
$validated = $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|email',
    'content' => 'required|string',
]);

// Prevents injection attacks
$post = Post::create($validated);
```

## SQL Injection Prevention

### Use Parameter Binding
```php
// Safe: parameterized query
$posts = Post::where('author_id', $userId)->get();

// Safe: query builder
$posts = Post::whereRaw('author_id = ?', [$userId])->get();

// NEVER DO THIS:
// $posts = Post::whereRaw("author_id = $userId")->get(); // UNSAFE!
```

### Prepared Statements
```php
// All Eloquent queries use prepared statements automatically
DB::statement('UPDATE users SET email = ? WHERE id = ?', [
    $email,
    $userId,
]);
```

## Authentication Security

### Secure Password Hashing
```php
// Hash passwords automatically
$user = User::create([
    'email' => 'user@example.com',
    'password' => Hash::make($request->password),
]);

// Verify password
if (Hash::check($request->password, $user->password)) {
    // Password is correct
}
```

### Authentication Guards
```php
// config/auth.php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'sanctum', // or 'token', 'jwt'
        'provider' => 'users',
    ],
],
```

## Mass Assignment Protection

### Fillable and Guarded
```php
class User extends Model
{
    // Whitelist: only these can be mass assigned
    protected $fillable = ['name', 'email', 'password'];

    // Blacklist: these cannot be mass assigned
    protected $guarded = ['is_admin', 'role'];
}
```

### Safe Mass Assignment
```php
// Safe: only fillable fields are assigned
$user = User::create($request->validated());

// Get validated data
$validated = $request->validate([
    'name' => 'required|string',
    'email' => 'required|email',
]);
```

## Rate Limiting

### Throttle Requests
```php
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1'); // 5 requests per minute

// Custom rate limit
Route::middleware('throttle:60,1')->group(function () {
    // 60 requests per minute
});
```

### Custom Rate Limiting
```php
// app/Http/Middleware/RateLimitMiddleware.php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

## Headers Security

### Set Security Headers
```php
// Middleware or response
return response($content)
    ->header('X-Content-Type-Options', 'nosniff')
    ->header('X-Frame-Options', 'DENY')
    ->header('X-XSS-Protection', '1; mode=block')
    ->header('Referrer-Policy', 'strict-origin-when-cross-origin');
```

## See Also
- [[authentication-authorization]]
- [[validation-rules]]
- [[api-authentication]]
