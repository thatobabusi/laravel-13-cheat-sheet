# Views & Blade

> Render views and use Blade template engine for dynamic HTML.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** HTTP

## Rendering Views

```php
return view('posts.index');
return view('posts.show', ['post' => $post]);
return view('posts.show', compact('post', 'comments'));
return view('posts.show')->with('post', $post)->with('user', $user);
```

## View Composers

Share data across views automatically:

```php
// AppServiceProvider::boot
View::share('siteTitle', config('app.name'));

// Composer for specific views
View::composer('sidebar', function (View $view) {
    $view->with('categories', Category::all());
});

View::composer(['nav', 'sidebar'], NavComposer::class);
```

## Blade Syntax

### Comments & Output

```blade
{{-- Blade comment --}}

{{-- Output (HTML-escaped) --}}
{{ $variable }}
{{ $user->name ?? 'Guest' }}
{{ old('email') }}

{{-- Raw output (unescaped) --}}
{!! $html !!}
```

### Conditionals

```blade
@if ($condition)
    <!-- ... -->
@elseif ($other)
    <!-- ... -->
@else
    <!-- ... -->
@endif

@unless ($condition)
    <!-- shown if NOT condition -->
@endunless

@isset($var)
    <!-- shown if variable is set -->
@endisset

@empty($var)
    <!-- shown if variable is empty -->
@endempty

@switch($status)
    @case('active')   Active   @break
    @case('inactive') Inactive @break
    @default          Unknown
@endswitch
```

### Loops

```blade
@foreach ($posts as $post)
    {{ $loop->index }}        {{-- 0-based index --}}
    {{ $loop->iteration }}    {{-- 1-based --}}
    {{ $loop->first }}        {{-- bool --}}
    {{ $loop->last }}         {{-- bool --}}
    {{ $loop->count }}
    {{ $loop->remaining }}
    {{ $loop->depth }}        {{-- nesting level --}}
    {{ $loop->parent }}       {{-- parent $loop in nested loops --}}
@endforeach

@forelse ($posts as $post)
    {{ $post->title }}
@empty
    <p>No posts found.</p>
@endforelse

@for ($i = 0; $i < 10; $i++)
    {{ $i }}
@endfor

@while ($condition)
    <!-- ... -->
@endwhile

@continue
@continue($i === 5)    {{-- conditional --}}
@break
@break($i === 5)
```

### Template Inheritance

```blade
{{-- layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head><title>@yield('title', 'App')</title></head>
<body>
    @yield('content')
    @stack('scripts')
</body>
</html>

{{-- Child view --}}
@extends('layouts.app')

@section('title', 'Posts')

@section('content')
    <p>Content here</p>
@endsection

@push('scripts')
    <script>...</script>
@endpush

@prepend('scripts')
    <script>/* first */</script>
@endprepend
```

### Includes

```blade
@include('partials.nav')
@include('partials.alert', ['type' => 'success'])
@includeIf('partials.optional')
@includeWhen($condition, 'partials.admin-nav')
@includeUnless($condition, 'partials.nav')
@includeFirst(['partials.custom-nav', 'partials.nav'])

{{-- Loop + include --}}
@each('partials.post-card', $posts, 'post', 'partials.no-posts')
```

### Raw PHP & Directives

```blade
@php $total = $price * $qty; @endphp

@auth
    Hello, {{ auth()->user()->name }}
@endauth
@guest
    <a href="/login">Login</a>
@endguest
@auth('admin') ... @endauth

@can('update', $post)   <a href="...">Edit</a> @endcan
@cannot('delete', $post) ... @endcannot
@canany(['update', 'delete'], $post) ... @endcanany

@env('local') ... @endenv
@env(['local', 'staging']) ... @endenv
@production ... @endproduction

@csrf
@method('PUT')

@error('email') <span>{{ $message }}</span> @enderror

@vite(['resources/css/app.css', 'resources/js/app.js'])

{{-- Skip Blade parsing for Vue/Alpine --}}
@verbatim
    <div>{{ vueVariable }}</div>
@endverbatim
```

## Blade Components

### Class-based Components

```php
// Create: php artisan make:component Alert
// app/View/Components/Alert.php
class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public string $message = '',
    ) {}

    public function render(): View
    {
        return view('components.alert');
    }
}
```

### Component Template

```blade
{{-- resources/views/components/alert.blade.php --}}
<div class="alert alert-{{ $type }}">
    {{ $slot }}               {{-- default slot --}}
    {{ $title }}              {{-- named slot --}}
    {{ $attributes }}         {{-- pass-through HTML attrs --}}
</div>

{{-- Usage --}}
<x-alert type="success">
    <x-slot:title>Done!</x-slot:title>
    Your post was created.
</x-alert>

{{-- Attribute merging --}}
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
```

### Anonymous Components

```blade
{{-- resources/views/components/button.blade.php --}}
@props(['color' => 'blue'])
<button class="btn btn-{{ $color }}">{{ $slot }}</button>

{{-- Usage --}}
<x-button color="red">Delete</x-button>
```

---

**See Also:** [[controllers]] | [[responses]] | [[requests]]
