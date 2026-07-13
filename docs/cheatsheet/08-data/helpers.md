# Helpers

> Global helper functions for common operations across Laravel.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Data Processing

## App & Environment

```php
app();                                  // service container
app('path');
app()->environment();
app()->isProduction();
app()->isLocal();
app()->runningInConsole();
app()->runningUnitTests();
app()->version();
abort(403);
abort(403, 'Not allowed.');
abort_if($condition, 403);
abort_unless($condition, 200);
```

## Paths

```php
base_path('app/Models');
app_path('Http/Controllers');
config_path('app.php');
database_path('migrations');
public_path('images/logo.png');
resource_path('views/welcome.blade.php');
storage_path('logs/laravel.log');
lang_path('en/messages.php');
```

## Strings & Translation

```php
__('messages.welcome', ['name' => 'John']);   // translation
trans('messages.welcome');
trans_choice('messages.apples', 5);
e('<script>');                           // HTML escape
Str::of('hello');
str('hello');                            // shorthand
```

## Arrays

```php
data_get($arr, 'user.email', 'default');
data_set($arr, 'user.email', 'val');
data_fill($arr, 'user.email', 'val');    // only if not set
head([1,2,3]);                           // 1
last([1,2,3]);                           // 3
value('static');                         // 'static'
value(fn() => 'computed');              // 'computed'
blank('');                               // true
blank([]);
filled('hello');                         // true
```

## Auth & User

```php
auth();                                  // Auth facade shortcut
auth()->user();
auth()->id();
auth()->check();
auth()->guest();
```

## URLs

```php
url('/posts/1');
secure_url('/posts/1');
route('posts.show', $post);
action([PostController::class, 'show'], $post);
asset('images/logo.png');
secure_asset('images/logo.png');
mix('css/app.css');
Vite::asset('resources/images/logo.png');
```

## Requests & Responses

```php
request();
request('key', 'default');
response()->json($data);
redirect('/home');
back();
```

## Session & Flash

```php
session('key');
session(['key' => 'value']);
old('email');
old('email', 'default');
```

## Cache

```php
cache('key');
cache(['key' => 'value'], 600);
cache()->remember('key', 600, fn() => ...);
```

## Events & Jobs

```php
event(new UserRegistered($user));
dispatch(new ProcessPodcast($podcast));
dispatch_sync(new ProcessPodcast($podcast));
```

## Misc

```php
now();                                   // Carbon::now()
today();                                 // Carbon::today()
throw_if($condition, RuntimeException::class, 'message');
throw_unless($condition, RuntimeException::class, 'message');
rescue(fn() => risky(), 'fallback', report: true);
retry(5, fn() => Http::get('...'), 100);  // retry N times, 100ms delay
tap($post, fn($p) => $p->save());         // pass through, call fn
with($post, fn($p) => $p->title);         // transform and return
once(fn() => DB::count());               // run once per process (L11+)
defer(fn() => logger('cleanup'));         // run after response sent (L11+)
```

---

**See Also:** [[strings]] | [[arrays]] | [[collections]]
