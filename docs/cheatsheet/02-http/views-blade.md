# Views & Blade Templates

## Creating Views

```blade
<!-- Store in resources/views/greeting.blade.php -->
<h1>Hello, {{ $name }}!</h1>
```

## Returning Views from Routes

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'James']);
});

// With multiple data
Route::get('/users', function () {
    return view('users', [
        'users' => User::all(),
        'admin' => auth()->user(),
    ]);
});
```

## Blade Directives

### Echo Data

```blade
{{ $variable }}
{!! $html !!}} {{-- Without escaping --}}
{{ $variable ?? 'default' }} {{-- With default --}}
```

### Conditionals

```blade
@if ($user->isAdmin())
    <p>Welcome, admin!</p>
@elseif ($user->isModerator())
    <p>Welcome, moderator!</p>
@else
    <p>Welcome, user!</p>
@endif

@unless ($user->isAdmin())
    <p>You are not an admin.</p>
@endunless
```

### Loops

```blade
@foreach ($users as $user)
    <p>{{ $user->name }}</p>
    @if ($loop->first)
        <p>This is the first item.</p>
    @endif
@endforeach

@forelse ($users as $user)
    <p>{{ $user->name }}</p>
@empty
    <p>No users found.</p>
@endforelse
```

## Template Inheritance

```blade
<!-- Master Template: resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>@yield('title')</title>
</head>
<body>
    @yield('content')
</body>
</html>

<!-- Child Template -->
@extends('layouts.app')
@section('title', 'Page Title')
@section('content')
    <p>Page content</p>
@endsection
```

## Components

```php
<!-- Create component: php artisan make:component Alert -->
// resources/views/components/alert.blade.php
<div class="alert alert-{{ $type }}">
    {{ $slot }}
</div>
```

```blade
<!-- Using component -->
<x-alert type="danger">
    This is a danger alert!
</x-alert>
```

## Includes

```blade
@include('shared.errors')
@include('view.name', ['name' => 'James'])
@includeIf('view.name')
@includeWhen($condition, 'view.name')
```

## Common Directives

```blade
@csrf                    {{-- CSRF token --}}
@method('PUT')          {{-- HTTP method spoofing --}}

@auth
    <p>User is logged in</p>
@endauth

@guest
    <p>User is guest</p>
@endguest

@can('update', $post)
    <p>You can update this post</p>
@endcan

@error('email')
    <span>{{ $message }}</span>
@enderror

@checked($user->active)
@disabled($user->disabled)
@selected($status === 'active')
```
