# Caching Strategies

## Cache Drivers

### Configuration
```php
// config/cache.php
'default' => env('CACHE_DRIVER', 'file'),

'stores' => [
    'file' => [
        'driver' => 'file',
        'path' => storage_path('framework/cache'),
    ],
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
    ],
    'database' => [
        'driver' => 'database',
        'table' => 'cache',
    ],
]
```

## Basic Cache Operations

### Set and Get
```php
// Set cache for 60 minutes
Cache::put('key', 'value', now()->addMinutes(60));

// Get cache
$value = Cache::get('key');

// Get with default
$value = Cache::get('key', 'default');

// Check if exists
if (Cache::has('key')) { }

// Forget cache
Cache::forget('key');

// Flush all cache
Cache::flush();
```

## Remember and Pull

### Cache::remember()
```php
// Retrieve from cache or store result
$posts = Cache::remember('posts:user:' . $user->id, 3600, function () {
    return Post::where('user_id', $user->id)->get();
});
```

### Cache::rememberForever()
```php
$config = Cache::rememberForever('app:config', function () {
    return Config::all();
});
```

### Cache::pull()
```php
// Get value and delete immediately
$value = Cache::pull('key');
```

## Cache Tags

### Tag-based Caching
```php
// Store with tags
Cache::tags(['posts', 'user:1'])->put('posts:user:1', $posts, 3600);

// Retrieve with tags
$posts = Cache::tags(['posts', 'user:1'])->get('posts:user:1');

// Flush by tag
Cache::tags(['user:1'])->flush(); // Flush all user:1 related caches
```

## Query Result Caching

### Cache Query Results
```php
$posts = Cache::remember('posts:published', 3600, function () {
    return Post::where('published', true)
        ->orderBy('created_at', 'desc')
        ->get();
});
```

### Invalidate on Updates
```php
class Post extends Model
{
    protected static function booted()
    {
        static::saved(function ($model) {
            Cache::forget('posts:published');
            Cache::forget('posts:user:' . $model->user_id);
        });
    }
}
```

## View Caching

### Cache Blade Views
```php
{{-- In blade template --}}
@cache
    <div class="expensive-component">
        {{-- Cached for 5 minutes --}}
    </div>
@endcache

{{-- With custom ttl --}}
@cache(['ttl' => 3600])
    <!-- Cached content -->
@endcache

{{-- With tags for invalidation --}}
@cache(['tags' => ['user-' . $user->id]])
    <!-- Cached content -->
@endcache
```

## HTTP Cache Headers

### Control Browser Caching
```php
return response($content)
    ->header('Cache-Control', 'public, max-age=3600')
    ->header('ETag', md5($content));
```

### Cache Control Shortcuts
```php
return response($content)
    ->withHeaders([
        'Cache-Control' => 'public, max-age=86400', // 24 hours
        'Pragma' => 'cache',
    ]);
```

## Cache Busting

### Automatic Cache Busting
```php
// Use timestamps or version numbers
$assetUrl = asset('css/app.css?v=' . config('app.version'));

// In Blade
<script src="{{ asset('js/app.js?t=' . time()) }}"></script>
```

### Manual Cache Invalidation
```php
// Forget specific cache
Cache::forget('posts:1');

// Forget multiple
Cache::forget(['posts:1', 'posts:2', 'posts:3']);

// Flush specific tags
Cache::tags('posts')->flush();
```

## Cache Patterns

### Cache-Aside Pattern
```php
function getUser($id)
{
    return Cache::remember("user:$id", 3600, function () use ($id) {
        return User::find($id);
    });
}
```

### Write-Through Pattern
```php
class UserRepository
{
    public function save(User $user)
    {
        $user->save();
        Cache::put("user:{$user->id}", $user, 3600);
        return $user;
    }
}
```

## Redis Caching

### Setup Redis
```php
// .env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Redis Cache Operations
```php
// Same API as other drivers
Cache::put('key', 'value', 3600);

// Redis-specific operations
$value = Cache::connection('redis')->get('key');
```

## See Also
- [[query-optimization]]
- [[performance-profiling]]
- [[debugging-monitoring]]
