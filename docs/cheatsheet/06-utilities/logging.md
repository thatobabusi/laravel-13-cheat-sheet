# Logging & Context

> Log messages at different levels and add contextual information.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Utilities

## Log Levels (RFC 5424)

```php
use Illuminate\Support\Facades\Log;

Log::emergency('System down');
Log::alert('Action required');
Log::critical('Critical error');
Log::error('Error message', ['exception' => $e]);
Log::warning('Something odd');
Log::notice('Normal but notable');
Log::info('User logged in', ['user_id' => $user->id]);
Log::debug('Debug info', ['query' => $sql]);
```

## Channel Selection

```php
Log::channel('slack')->critical('Urgent!');
Log::stack(['single', 'slack'])->info('Multiple channels');
```

## Context (L11+ — propagates to all log entries automatically)

```php
use Illuminate\Support\Facades\Context;

Context::add('request_id', $requestId);
Context::add('user_id', auth()->id());
Context::addIf('env', fn() => app()->environment());
Context::push('breadcrumb', 'Controller');  // append to array

Context::get('request_id');
Context::all();
Context::has('user_id');
Context::forget('key');
Context::flush();

// Hidden context (not logged, but propagated to queued jobs)
Context::addHidden('password_hash', $hash);
Context::getHidden('password_hash');

// Dehydrate / rehydrate (for queued jobs)
Context::dehydrate();   // snapshot
Context::rehydrate($data);
```

---

**See Also:** [[helpers]] | [[debugging]]
