# Cookies

> Set and read cookies in HTTP responses and requests.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** Utilities

## Reading Cookies

```php
$request->cookie('name');
Cookie::get('name');
```

## Creating Cookies

Attached to response:

```php
response('hello')->cookie('name', 'value', $minutes);
response('hello')->cookie(
    name: 'name',
    value: 'value',
    minutes: 60,
    path: '/',
    domain: null,
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
);
```

## Queue Cookies

Attach without explicit response:

```php
Cookie::queue('name', 'value', 60);
Cookie::queue(Cookie::make('name', 'value', 60));
```

## Delete Cookies

```php
Cookie::expire('name');
return response('bye')->withoutCookie('name');
```

---

**See Also:** [[session]] | [[responses]]
