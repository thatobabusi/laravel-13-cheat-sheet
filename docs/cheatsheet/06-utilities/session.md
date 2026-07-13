# Session

> Store and retrieve session data across requests.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Utilities

## Storing in Session

```php
session(['key' => 'value']);
$request->session()->put('key', 'value');
$request->session()->push('user.teams', 'developers');  // push to array
$request->session()->increment('views');
$request->session()->increment('views', 5);
$request->session()->flash('status', 'Task done!');     // next request only
$request->session()->reflash();                         // keep flash for one more
$request->session()->keep(['status', 'username']);
```

## Retrieving from Session

```php
session('key');
session('key', 'default');
$request->session()->get('key');
$request->session()->get('key', 'default');
$request->session()->all();
$request->session()->pull('key');                       // get + delete
```

## Checking Session

```php
$request->session()->has('key');                        // exists AND not null
$request->session()->exists('key');                     // exists (even if null)
$request->session()->missing('key');
```

## Forgetting & Flushing

```php
$request->session()->forget('key');
$request->session()->forget(['key1', 'key2']);
$request->session()->flush();                           // clear all
```

## Session Management

```php
$request->session()->getId();
$request->session()->regenerate();
$request->session()->invalidate();                      // clear + regenerate
```

---

**See Also:** [[cookies]] | [[redirects]]
