# HTTP Client

> Make HTTP requests to external APIs using Laravel's HTTP client.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Utilities

## Basic Requests

```php
use Illuminate\Support\Facades\Http;

$response = Http::get('https://api.example.com/users');
$response = Http::post('https://api.example.com/users', ['name' => 'John']);
$response = Http::put('https://api.example.com/users/1', ['name' => 'Jane']);
$response = Http::patch('https://api.example.com/users/1', ['name' => 'Jane']);
$response = Http::delete('https://api.example.com/users/1');
```

## Response Methods

```php
$response->body();                         // raw string
$response->json();                         // decoded array
$response->json('data.0.name');            // dot-notation access
$response->collect('data');                // Collection
$response->object();                       // stdClass
$response->status();                       // 200
$response->ok();                           // 200
$response->successful();                   // 2xx
$response->redirect();                     // 3xx
$response->clientError();                  // 4xx
$response->serverError();                  // 5xx
$response->failed();                       // 4xx or 5xx
$response->header('Content-Type');
$response->headers();
$response->throw();                        // throw on error
$response->throwIf($condition);
$response->throwUnless($condition);
```

## Request Options

```php
Http::withHeaders(['X-Custom' => 'value'])
    ->withToken('my-token')               // Bearer auth
    ->withBasicAuth('user', 'pass')
    ->withDigestAuth('user', 'pass')
    ->withUserAgent('MyApp/1.0')
    ->timeout(30)
    ->connectTimeout(10)
    ->retry(3, 100)                        // 3 attempts, 100ms delay
    ->retry(3, fn($ms, $e) => $e->response->status() === 429 ? 5000 : $ms)
    ->accept('application/json')
    ->acceptJson()
    ->contentType('application/json')
    ->withBody('raw body', 'text/plain')
    ->withQueryParameters(['page' => 2])
    ->withUrlParameters(['version' => 'v1'])
    ->asForm()                             // application/x-www-form-urlencoded
    ->asJson()
    ->attach('avatar', file_get_contents('photo.jpg'), 'photo.jpg')
    ->withoutRedirecting()
    ->withoutVerifying()                   // disable SSL verification (dev only!)
    ->get('https://api.example.com/users');
```

## Base URL & Macros

```php
Http::baseUrl('https://api.example.com')->get('/users');

// Named macro (AppServiceProvider::boot)
Http::macro('github', fn() => Http::withToken(config('services.github.token'))
    ->baseUrl('https://api.github.com'));
Http::github()->get('/user');
```

## Concurrent Requests

```php
[$first, $second] = Http::pool(fn(Pool $pool) => [
    $pool->get('https://api.example.com/users'),
    $pool->get('https://api.example.com/posts'),
]);
```

## Testing

```php
Http::fake([
    'api.example.com/*' => Http::response(['name' => 'John'], 200),
    'other.com/*'       => Http::response('error', 500),
    '*'                 => Http::response('fallback', 200),
]);
Http::assertSent(fn($req) => $req->url() === 'https://api.example.com/users');
Http::assertNotSent(fn($req) => $req->url() === '...');
Http::assertNothingSent();
Http::assertSentCount(3);
```

---

**See Also:** [[cache]] | [[requests]]
