# Responses

> Send HTTP responses with various content types and headers.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** HTTP

## Basic Responses

```php
return response('Hello', 200);
return response()->make('Hello', 200, ['X-Custom' => 'value']);
```

## JSON Responses

```php
return response()->json(['data' => $posts]);
return response()->json($data, 201, [], JSON_PRETTY_PRINT);
```

## No Content

```php
return response()->noContent();           // 204
```

## View Responses

```php
return response()->view('posts.show', compact('post'), 200);
```

## File Responses

### Download

```php
return response()->download(storage_path('files/report.pdf'));
return response()->download($path, 'custom-name.pdf', $headers);
```

### Stream Download

```php
return response()->streamDownload(function () {
    echo file_get_contents('https://external-file.com/file.pdf');
}, 'report.pdf');
```

### Display in Browser

```php
return response()->file(storage_path('files/photo.jpg'));
```

## Headers & Cookies

```php
return response($content)
    ->header('Content-Type', 'application/json')
    ->withoutHeader('X-Powered-By')
    ->cookie('name', 'value', 60)          // expires in 60 min
    ->cookie(Cookie::make('key', 'val'));

// Attach cookie from queue
Cookie::queue('key', 'value', 60);
```

---

**See Also:** [[requests]] | [[redirects]] | [[cookies]]
