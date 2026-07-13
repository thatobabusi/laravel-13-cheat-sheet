# Cache

> Store and retrieve data from cache stores (Redis, Memcached, File, Database).
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Utilities

## Storing in Cache

```php
use Illuminate\Support\Facades\Cache;

Cache::put('key', 'value', 600);               // 600 seconds
Cache::put('key', 'value', now()->addHour());   // DateTime
Cache::set('key', 'value', 600);               // PSR-16 alias
Cache::forever('key', 'value');
Cache::add('key', 'value', 600);               // only if not exists; returns bool
Cache::putMany(['a' => 1, 'b' => 2], 600);
```

## Retrieving from Cache

```php
Cache::get('key');
Cache::get('key', 'default');
Cache::get('key', fn() => 'computed-default');
Cache::many(['a', 'b']);                        // array
$value = Cache::remember('key', 600, fn() => DB::table('posts')->count());
$value = Cache::rememberForever('key', fn() => ...);
Cache::pull('key');                             // get + delete
```

## Checking & Deleting

```php
Cache::has('key');
Cache::missing('key');
Cache::forget('key');
Cache::delete('key');                          // PSR-16 alias
Cache::flush();
Cache::deleteMany(['a', 'b']);
```

## Increment & Decrement

```php
Cache::increment('views');
Cache::increment('views', 5);
Cache::decrement('stock');
```

## Tags (Redis/Memcached only)

```php
Cache::tags(['posts', 'users'])->put('key', 'value', 600);
Cache::tags(['posts'])->get('key');
Cache::tags(['posts'])->flush();
```

## Store Selection

```php
Cache::store('redis')->get('key');
Cache::store('file')->put('key', 'value', 600);
```

## Atomic Locking

```php
$lock = Cache::lock('processing', 10);         // 10-second lock
if ($lock->get()) {
    // exclusive work...
    $lock->release();
}

Cache::lock('processing', 10)->block(5, function () {
    // wait up to 5s to acquire, then run
});
```

---

**See Also:** [[session]] | [[http-client]]
