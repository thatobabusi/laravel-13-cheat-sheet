# Laravel 13 Cheat Sheet

> **PHP 8.2+ · Laravel 13 · Slim skeleton (no RouteServiceProvider / HttpKernel)**
> Sources: [laravel.com/docs](https://laravel.com/docs) · [github.com/laravel/framework](https://github.com/laravel/framework)

---

## Table of Contents

| # | Section | # | Section |
|---|---|---|---|
| 1 | [Artisan](#artisan) | 18 | [HTTP Client](#http-client) |
| 2 | [Application Bootstrap](#application-bootstrap) | 19 | [Cache](#cache) |
| 3 | [Config](#config) | 20 | [Session](#session) |
| 4 | [Routing](#routing) | 21 | [Cookies](#cookies) |
| 5 | [Middleware](#middleware) | 22 | [Storage](#storage) |
| 6 | [Controllers](#controllers) | 23 | [Logging & Context](#logging--context) |
| 7 | [Requests](#requests) | 24 | [Service Container](#service-container) |
| 8 | [Responses](#responses) | 25 | [Service Providers](#service-providers) |
| 9 | [Redirects](#redirects) | 26 | [Collections](#collections) |
| 10 | [Views & Blade](#views--blade) | 27 | [Strings — Str](#strings--str) |
| 11 | [Eloquent ORM](#eloquent-orm) | 28 | [Arrays — Arr](#arrays--arr) |
| 12 | [Query Builder](#query-builder) | 29 | [Helpers](#helpers) |
| 13 | [Schema & Migrations](#schema--migrations) | 30 | [Validation](#validation) |
| 14 | [Authentication & Sanctum](#authentication--sanctum) | 31 | [Events & Listeners](#events--listeners) |
| 15 | [Authorization](#authorization) | 32 | [Jobs & Queues](#jobs--queues) |
| 16 | [Notifications](#notifications) | 33 | [Task Scheduling](#task-scheduling) |
| 17 | [Mail](#mail) | 34 | [Testing — Pest / PHPUnit](#testing--pest--phpunit) |

---

## Artisan

```bash
# ── Help & Meta ──────────────────────────────────────────────────────────────
php artisan                          # list all commands
php artisan help migrate             # help for a specific command
php artisan --version
php artisan about                    # framework, environment, drivers summary
php artisan env                      # display current environment

# ── Application ──────────────────────────────────────────────────────────────
php artisan key:generate
php artisan storage:link             # create public/storage symlink
php artisan down [--secret=token]    # maintenance mode
php artisan up

# ── Dev server ───────────────────────────────────────────────────────────────
php artisan serve
php artisan serve --port=8080

# ── Make ─────────────────────────────────────────────────────────────────────
php artisan make:model Post
php artisan make:model Post -m          # + migration
php artisan make:model Post -mfsc       # + migration, factory, seeder, controller
php artisan make:model Post --all       # everything above + policy, resource
php artisan make:controller PostController
php artisan make:controller PostController --resource
php artisan make:controller PostController --api   # resource without create/edit
php artisan make:controller PostController --singleton
php artisan make:migration create_posts_table
php artisan make:migration add_status_to_posts_table --table=posts
php artisan make:seeder PostSeeder
php artisan make:factory PostFactory
php artisan make:request StorePostRequest
php artisan make:resource PostResource
php artisan make:resource PostCollection --collection
php artisan make:event PostPublished
php artisan make:listener SendPostNotification --event=PostPublished
php artisan make:observer PostObserver --model=Post
php artisan make:job ProcessPodcast
php artisan make:mail WelcomeMail --markdown=emails.welcome
php artisan make:notification InvoicePaid
php artisan make:policy PostPolicy --model=Post
php artisan make:provider AppServiceProvider
php artisan make:middleware EnsureTokenIsValid
php artisan make:command SendEmails
php artisan make:channel OrderChannel
php artisan make:rule Uppercase
php artisan make:scope ActiveScope
php artisan make:enum Status
php artisan make:class Support/Helpers/CurrencyConverter
php artisan make:interface Contracts/PaymentGateway
php artisan make:trait Concerns/HasUuid
php artisan make:view posts.index

# ── Database ──────────────────────────────────────────────────────────────────
php artisan migrate
php artisan migrate --force           # run in production
php artisan migrate:fresh             # drop all + re-migrate
php artisan migrate:fresh --seed
php artisan migrate:refresh           # rollback all + re-migrate
php artisan migrate:rollback          # rollback last batch
php artisan migrate:rollback --step=3
php artisan migrate:reset             # rollback all
php artisan migrate:status
php artisan db:seed
php artisan db:seed --class=PostSeeder
php artisan db:wipe                   # drop all tables, views, types
php artisan db                        # open DB CLI (mysql/psql/sqlite3)
php artisan model:show Post           # show model info (columns, relations, etc.)
php artisan model:prune               # delete prunable models

# ── Route ────────────────────────────────────────────────────────────────────
php artisan route:list
php artisan route:list --path=api
php artisan route:cache
php artisan route:clear

# ── Config / Cache ────────────────────────────────────────────────────────────
php artisan config:cache
php artisan config:clear
php artisan config:publish            # publish vendor config files
php artisan view:cache
php artisan view:clear
php artisan event:cache
php artisan event:clear
php artisan optimize                  # config + route + view cache
php artisan optimize:clear

# ── Queue ─────────────────────────────────────────────────────────────────────
php artisan queue:work
php artisan queue:work --queue=high,default
php artisan queue:listen
php artisan queue:restart
php artisan queue:failed
php artisan queue:retry all
php artisan queue:flush               # delete all failed jobs
php artisan queue:prune-failed --hours=48

# ── Schedule ──────────────────────────────────────────────────────────────────
php artisan schedule:run              # run due scheduled tasks
php artisan schedule:work             # run scheduler in foreground (local dev)
php artisan schedule:list

# ── API / Broadcasting setup ───────────────────────────────────────────────────
php artisan install:api               # Sanctum + api.php route file
php artisan install:broadcasting      # Reverb + channels.php

# ── Misc ─────────────────────────────────────────────────────────────────────
php artisan tinker
php artisan channel:list
php artisan inspect:events            # list unused event listeners
php artisan vendor:publish --provider="Vendor\Package\ServiceProvider"
php artisan vendor:publish --tag=config
```

---

## Application Bootstrap

> Laravel 13 configures middleware, routing, and exceptions in `bootstrap/app.php`.

```php
// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',                           // built-in health check endpoint
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Append / prepend global middleware
        $middleware->append(MyMiddleware::class);
        $middleware->prepend(MyMiddleware::class);

        // Alias
        $middleware->alias(['auth.custom' => MyAuthMiddleware::class]);

        // Middleware groups
        $middleware->appendToGroup('web', MyWebMiddleware::class);
        $middleware->appendToGroup('api', MyApiMiddleware::class);

        // Throttle
        $middleware->throttleApi('60,1');        // 60 req/minute
        $middleware->throttleApi(             // per-second limiting (L11+)
            limiter: 'api',
            perSecond: 5,
        );

        // Exclude routes from middleware
        $middleware->validateCsrfTokens(except: ['/stripe/webhook']);

        // Stateless API (skip sessions)
        $middleware->statefulApi();

        // Trust proxies
        $middleware->trustProxies(at: '*');
        $middleware->trustHosts(at: ['laravel.com']);

        // Redirect guests
        $middleware->redirectGuestsTo('/login');
        $middleware->redirectUsersTo('/dashboard');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Custom rendering
        $exceptions->render(function (ModelNotFoundException $e, Request $req) {
            return response()->json(['message' => 'Not found'], 404);
        });

        // Reportable
        $exceptions->report(function (InvalidOrderException $e) {
            // custom logging
        })->stop();                              // don't bubble to default handler

        // Don't report certain exceptions
        $exceptions->dontReport(PaymentDeclinedException::class);
        $exceptions->dontFlash(['password', 'password_confirmation']);

        // Throttle exception reporting
        $exceptions->throttle(fn($e) => Limit::perMinute(10));
    })
    ->create();
```

---

## Config

```php
// Read
config('app.name');
config('mail.from.address', 'fallback@example.com');  // with default

// Set at runtime
config(['app.locale' => 'en']);

// All config values
config()->all();

// Check existence
Config::has('services.stripe.key');
```

---

## Routing

### Basic Routes

```php
// routes/web.php
Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::patch('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);
Route::any('/posts', [PostController::class, 'index']);
Route::match(['get', 'post'], '/posts', [PostController::class, 'index']);

// Closure route
Route::get('/welcome', fn() => view('welcome'));

// API routes (routes/api.php — prefix /api auto-applied)
Route::get('/users', [UserController::class, 'index']);
```

### Route Parameters

```php
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/posts/{post?}', [PostController::class, 'show']);  // optional

// Constraints
Route::get('/users/{id}', fn($id) => ...)->where('id', '[0-9]+');
Route::get('/users/{id}', fn($id) => ...)->whereNumber('id');
Route::get('/slugs/{slug}', fn($slug) => ...)->whereAlphaNumeric('slug');
Route::get('/search/{query}', fn($q) => ...)->whereAlpha('query');
Route::get('/posts/{category}/{post}', fn($c, $p) => ...)->whereIn('category', ['tech','life']);

// Global constraints (AppServiceProvider::boot)
Route::pattern('id', '[0-9]+');
```

### Route Groups

```php
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('posts', PostController::class);
});

// Controller shorthand (L9+)
Route::controller(PostController::class)->group(function () {
    Route::get('/posts', 'index');
    Route::post('/posts', 'store');
});

// Subdomain routing
Route::domain('{account}.example.com')->group(function () {
    Route::get('/', [AccountController::class, 'show']);
});
```

### Named Routes

```php
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Generate URLs
route('posts.show', ['post' => $post]);         // /posts/1
route('posts.show', $post);                     // model resolved automatically
url()->route('posts.show', $post, absolute: false);  // relative URL

// Check current route
request()->routeIs('posts.*');
```

### Resource Routes

```php
Route::resource('posts', PostController::class);
Route::resource('posts', PostController::class)->only(['index', 'show']);
Route::resource('posts', PostController::class)->except(['destroy']);
Route::resource('posts', PostController::class)->shallow();    // shallow nesting

// Nested resource
Route::resource('posts.comments', CommentController::class);

// API resource (no create/edit)
Route::apiResource('posts', PostController::class);

// Singleton resource (settings page)
Route::singleton('profile', ProfileController::class);
Route::apiSingleton('profile', ProfileController::class);
```

### Route Model Binding

```php
// Implicit (type-hint matches route segment name)
Route::get('/posts/{post}', function (Post $post) { ... });

// Explicit binding (AppServiceProvider::boot)
Route::model('post', Post::class);

// Custom resolution logic
Route::bind('post', fn($value) => Post::where('slug', $value)->firstOrFail());

// Resolve by different column
Route::get('/posts/{post:slug}', fn(Post $post) => ...);

// Scoped binding (child scoped to parent)
Route::get('/users/{user}/posts/{post:slug}', fn(User $user, Post $post) => ...);

// Model::resolveRouteBindingQuery override (in model)
public function resolveRouteBindingQuery($query, $value, $field = null)
{
    return $query->where($field ?? 'slug', $value)->withTrashed();
}
```

### Redirect & Fallback Routes

```php
Route::redirect('/old', '/new', 301);
Route::permanentRedirect('/old', '/new');

Route::view('/about', 'about');
Route::view('/about', 'about', ['name' => 'Laravel']);

Route::fallback(fn() => view('errors.404'));
```

---

## Middleware

```php
// Create
php artisan make:middleware EnsureTokenIsValid

// app/Http/Middleware/EnsureTokenIsValid.php
public function handle(Request $request, Closure $next): Response
{
    if ($request->input('token') !== 'my-secret') {
        return redirect('/home');
    }
    return $next($request);           // pass to next middleware
}

// After middleware (runs after response is sent)
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);
    // do work after response...
    return $response;
}

// Middleware with parameters
public function handle(Request $request, Closure $next, string $role): Response
{
    if (!$request->user()->hasRole($role)) abort(403);
    return $next($request);
}
// Usage on route:
Route::get('/admin', ...)->middleware('role:admin');

// Register alias in bootstrap/app.php
$middleware->alias(['role' => CheckRole::class]);

// Apply to route
Route::get('/admin', ...)->middleware(EnsureTokenIsValid::class);
Route::get('/admin', ...)->middleware(['auth', 'verified', 'role:admin']);

// Exclude middleware for specific routes
Route::get('/webhook', ...)->withoutMiddleware(VerifyCsrfToken::class);
```

---

## Controllers

```php
// Basic
class PostController extends Controller
{
    public function index(): View
    {
        return view('posts.index', ['posts' => Post::paginate(15)]);
    }

    public function show(Post $post): View         // model binding
    {
        return view('posts.show', compact('post'));
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = Post::create($request->validated());
        return redirect()->route('posts.show', $post)->with('success', 'Created!');
    }
}

// Single-action controller
class ShowDashboard extends Controller
{
    public function __invoke(): View
    {
        return view('dashboard');
    }
}
Route::get('/dashboard', ShowDashboard::class);

// Dependency injection in constructor
public function __construct(
    private readonly PostService $service,
) {}
```

---

## Requests

```php
// Accessing input
$request->input('name');
$request->input('user.email');            // dot notation for nested
$request->input('products.*.price');      // wildcard
$request->input('name', 'default');       // with default
$request->string('name')->upper();        // fluent string
$request->integer('page');
$request->float('amount');
$request->boolean('active');
$request->date('birthday');
$request->date('birthday', 'Y-m-d', 'Africa/Johannesburg');
$request->enum('status', Status::class);
$request->collect('ids');                 // returns Collection
$request->all();
$request->only(['name', 'email']);
$request->except(['_token', 'password']);
$request->filled('name');                 // present AND not empty
$request->isNotEmpty('name');
$request->missing('name');
$request->has('name');
$request->has(['name', 'email']);         // all must be present
$request->hasAny(['name', 'username']);   // any present
$request->whenHas('name', fn($v) => ...);
$request->whenFilled('name', fn($v) => ...);
$request->query('page');                  // query string only
$request->post('name');                   // POST body only

// Request meta
$request->path();                         // posts/1
$request->url();                          // https://example.com/posts/1
$request->fullUrl();                      // with query string
$request->fullUrlWithQuery(['page' => 2]);
$request->fullUrlWithoutQuery(['page']);
$request->host();
$request->method();                       // GET, POST, etc.
$request->isMethod('post');
$request->ip();
$request->ips();
$request->userAgent();
$request->header('X-Custom');
$request->bearerToken();
$request->expectsJson();
$request->wantsJson();
$request->isJson();
$request->accepts(['text/html', 'application/json']);
$request->ajax();                         // X-Requested-With: XMLHttpRequest
$request->secure();                       // HTTPS?
$request->pjax();

// Route info
$request->route('id');                    // get route parameter
$request->routeIs('posts.*');
$request->is('admin/*');                  // URL pattern match

// Files
$request->hasFile('avatar');
$file = $request->file('avatar');
$file->isValid();
$file->getClientOriginalName();
$file->getClientOriginalExtension();
$file->getMimeType();
$file->getSize();
$file->store('avatars');                  // store in default disk
$file->store('avatars', 'public');
$file->storeAs('avatars', 'user-1.jpg', 'public');
$file->storePublicly('avatars');

// Form Request
// app/Http/Requests/StorePostRequest.php
class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);
    }

    public function rules(): array
    {
        return [
            'title'   => ['required', 'string', 'max:255'],
            'body'    => ['required', 'string'],
            'tags'    => ['array'],
            'tags.*'  => ['string', 'max:50'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['slug' => Str::slug($this->title)]);
    }

    public function messages(): array
    {
        return ['title.required' => 'A title is required.'];
    }

    public function attributes(): array
    {
        return ['body' => 'post body'];
    }

    protected function passedValidation(): void
    {
        // runs after successful validation
    }
}
```

---

## Responses

```php
// Basic
return response('Hello', 200);
return response()->make('Hello', 200, ['X-Custom' => 'value']);

// JSON
return response()->json(['data' => $posts]);
return response()->json($data, 201, [], JSON_PRETTY_PRINT);

// No content
return response()->noContent();           // 204

// View
return response()->view('posts.show', compact('post'), 200);

// File download
return response()->download(storage_path('files/report.pdf'));
return response()->download($path, 'custom-name.pdf', $headers);

// Stream download (no temp file)
return response()->streamDownload(function () {
    echo file_get_contents('https://external-file.com/file.pdf');
}, 'report.pdf');

// File display in browser
return response()->file(storage_path('files/photo.jpg'));

// Headers & cookies
return response($content)
    ->header('Content-Type', 'application/json')
    ->withoutHeader('X-Powered-By')
    ->cookie('name', 'value', 60)          // expires in 60 min
    ->cookie(Cookie::make('key', 'val'));

// Attach cookie from queue
Cookie::queue('key', 'value', 60);
```

---

## Redirects

```php
return redirect('/home');
return redirect()->to('/home');
return redirect()->route('posts.show', $post);
return redirect()->action([PostController::class, 'show'], $post);
return redirect()->away('https://external.com');
return redirect()->back();
return redirect()->back()->withInput();
return back()->with('status', 'Profile updated!');

// With flash data
return redirect('/home')->with('success', 'Done!');
return redirect('/home')->withErrors($validator);
return redirect('/home')->withErrors(['email' => 'Wrong email.']);

// Intended (after login)
return redirect()->intended('/dashboard');
```

---

## Views & Blade

### Rendering Views

```php
return view('posts.index');
return view('posts.show', ['post' => $post]);
return view('posts.show', compact('post', 'comments'));
return view('posts.show')->with('post', $post)->with('user', $user);

// Share across all views (AppServiceProvider::boot)
View::share('siteTitle', config('app.name'));

// View composers
View::composer('sidebar', function (View $view) {
    $view->with('categories', Category::all());
});
View::composer(['nav', 'sidebar'], NavComposer::class);
```

### Blade Syntax

```blade
{{-- Comment --}}

{{-- Output (escaped) --}}
{{ $variable }}
{{ $user->name ?? 'Guest' }}
{{ old('email') }}

{{-- Raw (unescaped) --}}
{!! $html !!}

{{-- Conditionals --}}
@if ($condition)
@elseif ($other)
@else
@endif

@unless ($condition)
@endunless

@isset($var)
@endisset

@empty($var)
@endempty

{{-- Switch --}}
@switch($status)
    @case('active')   Active   @break
    @case('inactive') Inactive @break
    @default          Unknown
@endswitch

{{-- Loops --}}
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
@endfor

@while ($condition)
@endwhile

@continue
@continue($i === 5)    {{-- conditional --}}
@break
@break($i === 5)

{{-- Template inheritance --}}
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

{{-- Include --}}
@include('partials.nav')
@include('partials.alert', ['type' => 'success'])
@includeIf('partials.optional')
@includeWhen($condition, 'partials.admin-nav')
@includeUnless($condition, 'partials.nav')
@includeFirst(['partials.custom-nav', 'partials.nav'])

{{-- Each (loop + include) --}}
@each('partials.post-card', $posts, 'post', 'partials.no-posts')

{{-- Raw PHP --}}
@php $total = $price * $qty; @endphp

{{-- Auth --}}
@auth
    Hello, {{ auth()->user()->name }}
@endauth
@guest
    <a href="/login">Login</a>
@endguest
@auth('admin') ... @endauth

{{-- Can --}}
@can('update', $post)   <a href="...">Edit</a> @endcan
@cannot('delete', $post) ... @endcannot
@canany(['update', 'delete'], $post) ... @endcanany

{{-- Env --}}
@env('local') ... @endenv
@env(['local', 'staging']) ... @endenv
@production ... @endproduction

{{-- CSRF & Method --}}
@csrf
@method('PUT')

{{-- Error --}}
@error('email') <span>{{ $message }}</span> @enderror

{{-- Vite assets --}}
@vite(['resources/css/app.css', 'resources/js/app.js'])

{{-- Verbatim (skip Blade parsing — for Vue/Alpine) --}}
@verbatim
    <div>{{ vueVariable }}</div>
@endverbatim
```

### Blade Components

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

{{-- Anonymous component (no PHP class needed) --}}
{{-- resources/views/components/button.blade.php --}}
@props(['color' => 'blue'])
<button class="btn btn-{{ $color }}">{{ $slot }}</button>

{{-- Usage --}}
<x-button color="red">Delete</x-button>
```

---

## Eloquent ORM

### Model Definition

```php
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $table      = 'posts';         // default: snake_plural class name
    protected $primaryKey = 'id';            // default: 'id'
    protected $keyType    = 'int';
    public    $incrementing = true;
    public    $timestamps   = true;          // created_at, updated_at
    protected $dateFormat   = 'U';           // Unix timestamp format

    // Mass-assignment
    protected $fillable = ['title', 'body', 'user_id'];
    // OR
    protected $guarded  = [];                // allow all (use with caution)

    // Casting (L10+: use method instead of property)
    protected function casts(): array
    {
        return [
            'published_at'  => 'datetime',
            'metadata'      => 'array',
            'is_active'     => 'boolean',
            'price'         => 'decimal:2',
            'status'        => Status::class,      // Enum cast
            'password'      => 'hashed',           // auto-hash on set
            'options'       => AsCollection::class,
            'address'       => AsValueObject::class,
        ];
    }

    // Hidden from serialization
    protected $hidden = ['password', 'remember_token'];

    // Always appended
    protected $appends = ['full_name'];

    // Accessors (L9+ syntax)
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->first_name.' '.$this->last_name,
        );
    }

    // Mutator
    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn($v) => ucfirst($v),
            set: fn($v) => strtolower($v),
        );
    }

    // Prunable (model:prune command)
    use Prunable;
    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subMonths(3));
    }
}
```

### Querying

```php
// Retrieve all
Post::all();
Post::all(['id', 'title']);

// Find
Post::find(1);
Post::find([1, 2, 3]);
Post::findOrFail(1);           // throws ModelNotFoundException
Post::findOrNew(1);            // returns new (unsaved) if not found
Post::findOr(1, fn() => abort(404));

// First
Post::first();
Post::firstWhere('is_active', true);
Post::firstOrFail();
Post::firstOrCreate(['email' => $email], ['name' => $name]);
Post::firstOrNew(['email' => $email], ['name' => $name]);
Post::sole();                  // expect exactly 1 result; throws if 0 or >1

// Where
Post::where('status', 'published')->get();
Post::where('status', '!=', 'draft')->get();
Post::where('views', '>', 100)->get();
Post::whereNull('deleted_at')->get();
Post::whereNotNull('published_at')->get();
Post::whereBetween('price', [10, 100])->get();
Post::whereNotBetween('price', [10, 100])->get();
Post::whereIn('status', ['published', 'featured'])->get();
Post::whereNotIn('status', ['draft'])->get();
Post::whereDate('created_at', '2025-01-01')->get();
Post::whereYear('created_at', 2025)->get();
Post::whereMonth('created_at', 1)->get();
Post::whereDay('created_at', 15)->get();
Post::whereColumn('updated_at', '>', 'created_at')->get();
Post::whereJsonContains('options->roles', 'admin')->get();
Post::whereJsonLength('options->tags', '>', 3)->get();

// Or where
Post::where('status', 'published')->orWhere('featured', true)->get();
Post::where(fn($q) => $q->where('a', 1)->orWhere('b', 2))->get();

// Ordering, grouping, limits
Post::orderBy('created_at', 'desc')->get();
Post::orderByDesc('created_at')->get();
Post::latest()->get();             // orderBy created_at desc
Post::oldest()->get();             // orderBy created_at asc
Post::latest('published_at')->get();
Post::inRandomOrder()->first();
Post::groupBy('category')->get();
Post::having('views', '>', 100)->get();
Post::take(5)->get();
Post::limit(5)->offset(10)->get();
Post::skip(10)->take(5)->get();

// Select
Post::select('id', 'title')->get();
Post::selectRaw('count(*) as total, status')->groupBy('status')->get();
Post::addSelect('published_at')->get();

// Aggregates
Post::count();
Post::max('views');
Post::min('price');
Post::avg('price');
Post::sum('views');
Post::exists();
Post::doesntExist();
Post::where('status', 'published')->count();

// Chunking (memory-friendly)
Post::chunk(200, function (Collection $posts) {
    foreach ($posts as $post) { /* ... */ }
});
Post::chunkById(200, function (Collection $posts) { /* ... */ });

// Lazy (generator)
foreach (Post::lazy() as $post) { /* ... */ }
Post::lazyById(200)->each(fn($post) => ...);

// Cursor (single query, yields models)
foreach (Post::where(...)->cursor() as $post) { /* ... */ }

// Pluck
Post::pluck('title');
Post::pluck('title', 'id');       // key => value Collection

// Value (single column, single row)
Post::where('id', 1)->value('title');

// Inserts
Post::create(['title' => 'Hello', 'body' => '...']);

Post::updateOrCreate(
    ['email' => 'john@example.com'],     // search criteria
    ['name' => 'John', 'age' => 30],     // values to set
);

Post::upsert([
    ['id' => 1, 'title' => 'A', 'views' => 5],
    ['id' => 2, 'title' => 'B', 'views' => 3],
], uniqueBy: ['id'], update: ['views']);

// Mass update
Post::where('status', 'draft')->update(['status' => 'published']);

// Increment / decrement
Post::where('id', 1)->increment('views');
Post::where('id', 1)->increment('views', 5, ['updated_at' => now()]);
Post::where('id', 1)->decrement('stock');

// Delete
$post->delete();
Post::where('status', 'draft')->delete();
Post::destroy([1, 2, 3]);
Post::destroy(collect([1, 2, 3]));
```

### Soft Deletes

```php
use Illuminate\Database\Eloquent\SoftDeletes;
class Post extends Model { use SoftDeletes; }
// Migration: $table->softDeletes();

$post->delete();               // sets deleted_at
$post->restore();
$post->forceDelete();

Post::withTrashed()->get();
Post::onlyTrashed()->get();
Post::withTrashed()->where('id', 1)->restore();
Post::trashed()->forceDelete();
```

### Relationships

```php
// One-to-one
public function profile(): HasOne
{
    return $this->hasOne(Profile::class, 'user_id', 'id');
}
// Inverse:
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id', 'id');
}

// One-to-many
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// Many-to-many
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')
                ->withPivot('assigned_at')
                ->withTimestamps()
                ->as('assignment');           // pivot alias
}
// Pivot access: $user->roles->first()->assignment->assigned_at

// Has-many-through
public function deployments(): HasManyThrough
{
    return $this->hasManyThrough(Deployment::class, Environment::class);
}

// Polymorphic
// In migration: $table->morphs('commentable'); // commentable_id + commentable_type
public function comments(): MorphMany
{
    return $this->morphMany(Comment::class, 'commentable');
}
public function commentable(): MorphTo
{
    return $this->morphTo();
}

// Many-to-many polymorphic
public function tags(): MorphToMany
{
    return $this->morphToMany(Tag::class, 'taggable');
}
```

### Eager Loading

```php
Post::with('author')->get();
Post::with(['author', 'comments'])->get();
Post::with('author:id,name')->get();          // select specific columns
Post::with(['comments' => function ($q) {
    $q->latest()->limit(5);
}])->get();
Post::with('author.profile')->get();           // nested
Post::withCount('comments')->get();            // adds comments_count
Post::withSum('orderItems', 'price')->get();   // adds order_items_sum_price
Post::withAvg('reviews', 'rating')->get();
Post::withMin('reviews', 'rating')->get();
Post::withMax('reviews', 'rating')->get();
Post::withExists('comments')->get();           // adds comments_exists (bool)

// Lazy eager loading
$posts = Post::all();
$posts->load('author', 'comments');
$posts->loadCount('comments');
$posts->loadMissing('author');                 // only if not already loaded

// Prevent lazy loading (AppServiceProvider::boot)
Model::preventLazyLoading(!app()->isProduction());
```

### Scopes

```php
// Local scope
public function scopePublished(Builder $query): void
{
    $query->where('status', 'published');
}
public function scopeOfType(Builder $query, string $type): void
{
    $query->where('type', $type);
}
// Usage:
Post::published()->ofType('news')->get();

// Global scope
use Illuminate\Database\Eloquent\Scope;
class ActiveScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('is_active', true);
    }
}
// Register in model:
protected static function booted(): void
{
    static::addGlobalScope(new ActiveScope);
    static::addGlobalScope('active', fn($b) => $b->where('is_active', true));
}
// Remove:
Post::withoutGlobalScope(ActiveScope::class)->get();
Post::withoutGlobalScopes()->get();
```

### Model Events & Observers

```php
// Inline in model
protected static function booted(): void
{
    static::creating(fn(Post $post) => $post->slug = Str::slug($post->title));
    static::created(fn(Post $post) => event(new PostCreated($post)));
    static::updating(fn($post) => ...);
    static::updated(fn($post) => ...);
    static::saving(fn($post) => ...);      // before create OR update
    static::saved(fn($post) => ...);
    static::deleting(fn($post) => ...);
    static::deleted(fn($post) => ...);
    static::restoring(fn($post) => ...);
    static::restored(fn($post) => ...);
    static::forceDeleting(fn($post) => ...);
    static::forceDeleted(fn($post) => ...);
    static::retrieved(fn($post) => ...);
}

// Observer class
class PostObserver
{
    public function creating(Post $post): void { ... }
    public function created(Post $post): void { ... }
    public function updating(Post $post): void { ... }
    public function updated(Post $post): void { ... }
    public function deleting(Post $post): void { ... }
    public function deleted(Post $post): void { ... }
}
// Register in AppServiceProvider::boot:
Post::observe(PostObserver::class);
```

### Factories

```php
// database/factories/PostFactory.php
class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'  => fake()->sentence(),
            'body'   => fake()->paragraphs(3, true),
            'status' => 'draft',
        ];
    }

    public function published(): static
    {
        return $this->state(['status' => 'published']);
    }

    public function withAuthor(User $user): static
    {
        return $this->state(['user_id' => $user->id]);
    }
}

// Usage in tests / seeders
Post::factory()->create();
Post::factory(10)->create();
Post::factory()->published()->create();
Post::factory()->for(User::factory())->create();   // belongsTo
Post::factory()->has(Comment::factory(3))->create();  // hasMany
Post::factory()->hasComments(3)->create();         // magic shorthand
Post::factory()->make();                           // don't persist
Post::factory()->raw();                            // plain array
Post::factory()->sequence(                        // cycle through values
    ['status' => 'draft'],
    ['status' => 'published'],
)->count(4)->create();
```

---

## Query Builder

```php
use Illuminate\Support\Facades\DB;

// Select
DB::table('posts')->get();
DB::table('posts')->select('id', 'title')->get();
DB::table('posts')->selectRaw('price * qty as total')->get();
DB::table('posts')->distinct()->get();
DB::table('posts')->addSelect('published_at')->get();

// Where
DB::table('posts')
    ->where('status', 'published')
    ->where('views', '>', 100)
    ->orWhere('featured', true)
    ->whereNull('deleted_at')
    ->whereBetween('price', [10, 100])
    ->whereIn('category', ['tech', 'life'])
    ->whereLike('title', '%laravel%')           // L11+
    ->whereNotLike('title', '%spam%')
    ->get();

// Joins
DB::table('posts')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->leftJoin('comments', 'posts.id', '=', 'comments.post_id')
    ->crossJoin('tags')
    ->get();

// Aggregates
DB::table('posts')->count();
DB::table('posts')->max('price');
DB::table('posts')->min('price');
DB::table('posts')->avg('price');
DB::table('posts')->sum('views');

// Order / Limit
DB::table('posts')->orderBy('created_at', 'desc')->get();
DB::table('posts')->orderByRaw('FIELD(status, "featured", "published")')->get();
DB::table('posts')->latest('published_at')->first();
DB::table('posts')->inRandomOrder()->first();
DB::table('posts')->limit(10)->offset(20)->get();

// Insert
DB::table('posts')->insert(['title' => 'Hi', 'created_at' => now()]);
DB::table('posts')->insertOrIgnore([['title' => 'A'], ['title' => 'B']]);
DB::table('posts')->insertGetId(['title' => 'Hi']);
DB::table('posts')->upsert(
    [['email' => 'a@b.com', 'name' => 'A']],
    ['email'],
    ['name'],
);

// Update
DB::table('posts')->where('id', 1)->update(['title' => 'Updated']);
DB::table('posts')->where('id', 1)->updateOrInsert(['email' => $e], ['name' => $n]);
DB::table('posts')->where('id', 1)->increment('views', 1);
DB::table('posts')->where('id', 1)->decrement('stock');

// Delete
DB::table('posts')->where('id', 1)->delete();
DB::table('posts')->truncate();

// Transactions
DB::transaction(function () {
    DB::table('orders')->update(['status' => 'processing']);
    DB::table('inventory')->decrement('qty');
});

DB::beginTransaction();
try {
    DB::commit();
} catch (\Throwable $e) {
    DB::rollBack();
    throw $e;
}

// After commit hooks
DB::afterCommit(fn() => event(new OrderPlaced()));   // L11+

// Raw expressions
DB::table('posts')->where(DB::raw('LOWER(title)'), 'hello')->get();
DB::select('SELECT * FROM posts WHERE id = ?', [1]);
DB::insert('INSERT INTO posts (title) VALUES (?)', ['Hello']);
DB::update('UPDATE posts SET views = views + 1 WHERE id = ?', [1]);
DB::delete('DELETE FROM posts WHERE id = ?', [1]);
DB::statement('DROP TABLE posts');

// Debug
DB::table('posts')->toSql();
DB::table('posts')->dd();                // dump SQL and die
DB::table('posts')->dump();              // dump without dying
DB::enableQueryLog();
$log = DB::getQueryLog();
DB::listen(fn($q) => logger($q->sql));
```

---

## Schema & Migrations

```php
// Create table
Schema::create('posts', function (Blueprint $table) {
    $table->id();                              // BIGINT UNSIGNED AUTO_INCREMENT PK
    $table->ulid('id')->primary();             // ULID primary key
    $table->uuid('id')->primary();             // UUID primary key
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('body');
    $table->longText('content');
    $table->tinyText('excerpt');
    $table->integer('views')->default(0);
    $table->unsignedInteger('qty');
    $table->bigInteger('total');
    $table->float('price', precision: 8);
    $table->decimal('price', total: 8, places: 2);
    $table->boolean('is_active')->default(true);
    $table->date('published_on');
    $table->dateTime('published_at');
    $table->timestamp('verified_at')->nullable();
    $table->timestampTz('scheduled_at');
    $table->year('year');
    $table->time('start_time');
    $table->json('metadata')->nullable();
    $table->jsonb('settings');                 // PostgreSQL
    $table->enum('status', ['draft','published','archived'])->default('draft');
    $table->set('permissions', ['read','write','admin']);
    $table->char('country_code', 2);
    $table->tinyInteger('rating');
    $table->smallInteger('priority');
    $table->mediumInteger('score');
    $table->double('latitude');
    $table->binary('data');
    $table->ipAddress('ip');
    $table->macAddress('mac');
    $table->uuid('token');
    $table->ulid('tracking_id');
    $table->rememberToken();                   // VARCHAR(100) nullable
    $table->softDeletes();                     // deleted_at TIMESTAMP nullable
    $table->timestamps();                      // created_at + updated_at

    // Foreign keys
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignUlid('team_id')->constrained();
    $table->foreignUuid('plan_id')->constrained();
    $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');

    // Morphs
    $table->morphs('commentable');             // commentable_id + commentable_type
    $table->nullableMorphs('imageable');
    $table->ulidMorphs('taggable');

    // Indexes
    $table->index('status');
    $table->index(['status', 'published_at']); // composite
    $table->unique(['email', 'tenant_id']);
    $table->primary(['user_id', 'role_id']);
    $table->fullText('body');                  // MySQL FULLTEXT

    // Column modifiers
    $table->string('middle_name')->nullable();
    $table->integer('views')->default(0)->unsigned();
    $table->string('title')->after('id');
    $table->string('title')->first();
    $table->string('bio')->invisible();        // MySQL — hidden from SELECT *
    $table->string('code')->virtualAs("UPPER(title)");
    $table->string('slug')->storedAs("LOWER(REPLACE(title,' ','-'))");
});

// Modify table
Schema::table('posts', function (Blueprint $table) {
    $table->string('summary')->nullable()->after('title');
    $table->string('title', 500)->change();    // change column definition
    $table->renameColumn('body', 'content');
    $table->dropColumn('views');
    $table->dropColumn(['views', 'clicks']);
    $table->dropSoftDeletes();
    $table->dropTimestamps();
    $table->dropRememberToken();
    $table->dropForeign(['user_id']);
    $table->dropIndex(['status']);
    $table->dropUnique(['email']);
    $table->dropPrimary();
});

// Drop
Schema::drop('posts');
Schema::dropIfExists('posts');
Schema::rename('posts', 'articles');

// Checks
Schema::hasTable('posts');
Schema::hasColumn('posts', 'title');
Schema::hasColumns('posts', ['title', 'body']);
Schema::getColumnType('posts', 'title');
Schema::getColumns('posts');
Schema::getIndexes('posts');
Schema::getForeignKeys('posts');

// Migration class
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) { ... });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

---

## Authentication & Sanctum

```php
// Check
Auth::check();
Auth::guest();
Auth::id();
Auth::user();                              // current user model

// Login
Auth::attempt(['email' => $e, 'password' => $p]);
Auth::attempt(['email' => $e, 'password' => $p], $remember);
Auth::attemptWhen(['email' => $e, 'password' => $p], fn($u) => $u->is_active);
Auth::login($user);
Auth::login($user, remember: true);
Auth::loginUsingId(1);
Auth::once(['email' => $e, 'password' => $p]);  // single-request auth

// Logout
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();

// Guards
Auth::guard('api')->user();
Auth::guard('admin')->attempt([...]);

// Sanctum — API tokens
// Install: php artisan install:api
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable { use HasApiTokens; }

$user->createToken('token-name')->plainTextToken;
$user->createToken('token-name', ['posts:read','posts:write'])->plainTextToken;
$user->tokens()->delete();                 // revoke all tokens
$request->user()->currentAccessToken()->delete();  // revoke current

// Token abilities
$request->user()->tokenCan('posts:write');

// Sanctum SPA (cookie-based)
// routes/api.php: Auth::routes() + Sanctum routes auto-added

// Auth in routes
Route::middleware('auth:sanctum')->group(function () { ... });
Route::middleware('auth')->group(function () { ... });           // session-based
```

---

## Authorization

```php
// Gates (AppServiceProvider::boot)
Gate::define('update-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});
Gate::define('view-admin', fn(User $user) => $user->is_admin);

// Check gates
Gate::allows('update-post', $post);
Gate::denies('update-post', $post);
Gate::any(['update-post', 'delete-post'], $post);
Gate::none(['update-post', 'delete-post'], $post);
Gate::check('update-post', $post);
Gate::authorize('update-post', $post);        // throws 403 if denied
Gate::inspect('update-post', $post);          // returns Response
Gate::forUser($user)->allows('update-post', $post);

// In controllers
$this->authorize('update', $post);
$this->authorize('create', Post::class);
$this->authorizeResource(Post::class, 'post');  // maps all resource actions

// Policies
php artisan make:policy PostPolicy --model=Post

class PostPolicy
{
    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Post $post): bool { return true; }
    public function create(User $user): bool { return $user->is_verified; }
    public function update(User $user, Post $post): bool { return $user->id === $post->user_id; }
    public function delete(User $user, Post $post): bool { return $user->id === $post->user_id; }
    public function restore(User $user, Post $post): bool { return $user->is_admin; }
    public function forceDelete(User $user, Post $post): bool { return $user->is_admin; }

    // Return Response for richer feedback
    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.', 403);
    }

    // Skip authorization for admins
    public function before(User $user, string $ability): bool|null
    {
        if ($user->is_admin) return true;
        return null;                           // defer to specific method
    }
}

// Register policy (auto-discovered in L9+ if models match)
// Or in AppServiceProvider::boot:
Gate::policy(Post::class, PostPolicy::class);

// Blade
@can('update', $post) ... @endcan
@cannot('update', $post) ... @endcannot
```

---

## Notifications

```php
php artisan make:notification InvoicePaid

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private Invoice $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Invoice Paid')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Your invoice has been paid.')
            ->action('View Invoice', url('/invoices/'.$this->invoice->id))
            ->line('Thank you!')
            ->salutation('Regards, '.config('app.name'));
    }

    public function toDatabase(object $notifiable): array
    {
        return ['invoice_id' => $this->invoice->id, 'amount' => $this->invoice->total];
    }

    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}

// Send
$user->notify(new InvoicePaid($invoice));
Notification::send($users, new InvoicePaid($invoice));   // collection
Notification::sendNow($user, new InvoicePaid($invoice)); // skip queue

// On-demand (no notifiable model)
Notification::route('mail', 'taylor@example.com')
            ->route('vonage', '5555555555')
            ->notify(new InvoicePaid($invoice));

// Database notifications
// Migration: php artisan notifications:table && php artisan migrate
$user->notifications;                       // all
$user->unreadNotifications;
$user->readNotifications;
$user->unreadNotifications()->count();
$notification->markAsRead();
$user->unreadNotifications()->update(['read_at' => now()]);
$user->notifications()->delete();
```

---

## Mail

```php
php artisan make:mail OrderShipped --markdown=emails.orders.shipped

class OrderShipped extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Shipped',
            from: new Address('shop@example.com', 'My Shop'),
            replyTo: [new Address('noreply@example.com')],
            tags: ['order-shipped'],
            metadata: ['order_id' => $this->order->id],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.orders.shipped',
            // OR: view: 'emails.orders.shipped',
            with: ['trackingNumber' => $this->order->tracking],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath('/path/to/file.pdf')->as('Invoice.pdf')->withMime('application/pdf'),
            Attachment::fromStorage('uploads/invoice.pdf'),
            Attachment::fromStorageDisk('s3', 'invoices/1.pdf'),
            Attachment::fromData(fn() => $this->order->generatePdf(), 'Invoice.pdf'),
        ];
    }
}

// Send
Mail::to($user)->send(new OrderShipped($order));
Mail::to('user@example.com')->cc($manager)->bcc($admin)->send(new OrderShipped($order));
Mail::to($user)->queue(new OrderShipped($order));
Mail::to($user)->later(now()->addHour(), new OrderShipped($order));
Mail::to($user)->sendNow(new OrderShipped($order));  // bypass queue

// Multiple recipients
Mail::to($users)->send(new OrderShipped($order));

// Markdown mail template (resources/views/emails/orders/shipped.blade.php)
// @component('mail::message')
// # Order Shipped
// @component('mail::button', ['url' => $url]) Track Order @endcomponent
// @endcomponent
```

---

## HTTP Client

```php
use Illuminate\Support\Facades\Http;

// Basic requests
$response = Http::get('https://api.example.com/users');
$response = Http::post('https://api.example.com/users', ['name' => 'John']);
$response = Http::put('https://api.example.com/users/1', ['name' => 'Jane']);
$response = Http::patch('https://api.example.com/users/1', ['name' => 'Jane']);
$response = Http::delete('https://api.example.com/users/1');

// Response
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

// Request options
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

// Base URL & macro
Http::baseUrl('https://api.example.com')->get('/users');

// Named macro (AppServiceProvider::boot)
Http::macro('github', fn() => Http::withToken(config('services.github.token'))
    ->baseUrl('https://api.github.com'));
Http::github()->get('/user');

// Concurrent requests
[$first, $second] = Http::pool(fn(Pool $pool) => [
    $pool->get('https://api.example.com/users'),
    $pool->get('https://api.example.com/posts'),
]);

// Fake in tests
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

## Cache

```php
use Illuminate\Support\Facades\Cache;

// Store
Cache::put('key', 'value', 600);               // 600 seconds
Cache::put('key', 'value', now()->addHour());   // DateTime
Cache::set('key', 'value', 600);               // PSR-16 alias
Cache::forever('key', 'value');
Cache::add('key', 'value', 600);               // only if not exists; returns bool
Cache::putMany(['a' => 1, 'b' => 2], 600);

// Retrieve
Cache::get('key');
Cache::get('key', 'default');
Cache::get('key', fn() => 'computed-default');
Cache::many(['a', 'b']);                        // array
$value = Cache::remember('key', 600, fn() => DB::table('posts')->count());
$value = Cache::rememberForever('key', fn() => ...);
Cache::pull('key');                             // get + delete

// Check / Delete
Cache::has('key');
Cache::missing('key');
Cache::forget('key');
Cache::delete('key');                          // PSR-16 alias
Cache::flush();
Cache::deleteMany(['a', 'b']);

// Increment / Decrement
Cache::increment('views');
Cache::increment('views', 5);
Cache::decrement('stock');

// Tags (Redis/Memcached only)
Cache::tags(['posts', 'users'])->put('key', 'value', 600);
Cache::tags(['posts'])->get('key');
Cache::tags(['posts'])->flush();

// Store selection
Cache::store('redis')->get('key');
Cache::store('file')->put('key', 'value', 600);

// Lock (atomic — Redis/database)
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

## Session

```php
// Store
session(['key' => 'value']);
$request->session()->put('key', 'value');
$request->session()->push('user.teams', 'developers');  // push to array
$request->session()->increment('views');
$request->session()->increment('views', 5);
$request->session()->flash('status', 'Task done!');     // next request only
$request->session()->reflash();                         // keep flash for one more
$request->session()->keep(['status', 'username']);

// Retrieve
session('key');
session('key', 'default');
$request->session()->get('key');
$request->session()->get('key', 'default');
$request->session()->all();
$request->session()->pull('key');                       // get + delete

// Check / Delete
$request->session()->has('key');                        // exists AND not null
$request->session()->exists('key');                     // exists (even if null)
$request->session()->missing('key');
$request->session()->forget('key');
$request->session()->forget(['key1', 'key2']);
$request->session()->flush();                           // clear all

// ID
$request->session()->getId();
$request->session()->regenerate();
$request->session()->invalidate();                      // clear + regenerate
```

---

## Cookies

```php
// Read
$request->cookie('name');
Cookie::get('name');

// Create (added to response)
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

// Queue (attach without explicit response)
Cookie::queue('name', 'value', 60);
Cookie::queue(Cookie::make('name', 'value', 60));

// Delete
Cookie::expire('name');
return response('bye')->withoutCookie('name');
```

---

## Storage

```php
use Illuminate\Support\Facades\Storage;

// Write
Storage::put('file.txt', 'Contents');
Storage::put('file.txt', $stream);
Storage::putFile('photos', $request->file('photo'));         // auto filename
Storage::putFileAs('photos', $request->file('photo'), 'user.jpg');
Storage::prepend('file.log', 'First line');
Storage::append('file.log', 'Last line');

// Read
Storage::get('file.txt');
Storage::json('data.json');                // decode JSON file
Storage::exists('file.txt');
Storage::missing('file.txt');
Storage::size('file.txt');
Storage::lastModified('file.txt');
Storage::mimeType('file.txt');
Storage::path('file.txt');                 // absolute local path

// URLs
Storage::url('file.txt');                  // public URL
Storage::temporaryUrl('file.txt', now()->addMinutes(5));   // S3 presigned
Storage::temporaryUploadUrl('file.txt', now()->addMinutes(5));  // upload URL

// Delete
Storage::delete('file.txt');
Storage::delete(['a.txt', 'b.txt']);

// Move / Copy
Storage::move('old.txt', 'new.txt');
Storage::copy('source.txt', 'dest.txt');

// Directories
Storage::makeDirectory('photos');
Storage::deleteDirectory('photos');
Storage::files('photos');                  // files in directory
Storage::allFiles('photos');               // recursive
Storage::directories('photos');
Storage::allDirectories('photos');

// Visibility
Storage::setVisibility('file.txt', 'public');
Storage::visibility('file.txt');           // 'public' | 'private'

// Disk selection
Storage::disk('s3')->put('file.txt', 'contents');
Storage::disk('local')->get('file.txt');

// Streaming
Storage::readStream('large.zip');
Storage::writeStream('large.zip', $stream);
```

---

## Logging & Context

```php
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Context;

// Log levels (RFC 5424)
Log::emergency('System down');
Log::alert('Action required');
Log::critical('Critical error');
Log::error('Error message', ['exception' => $e]);
Log::warning('Something odd');
Log::notice('Normal but notable');
Log::info('User logged in', ['user_id' => $user->id]);
Log::debug('Debug info', ['query' => $sql]);

// Channel selection
Log::channel('slack')->critical('Urgent!');
Log::stack(['single', 'slack'])->info('Multiple channels');

// Context (L11+ — propagates to all log entries automatically)
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

## Service Container

```php
use Illuminate\Support\Facades\App;

// Binding
app()->bind(PaymentGateway::class, StripeGateway::class);
app()->bind(PaymentGateway::class, fn($app) => new StripeGateway(
    config('services.stripe.key')
));

// Singleton
app()->singleton(ApiClient::class, fn($app) => new ApiClient(
    config('services.api.url')
));

// Scoped (singleton scoped to request lifecycle)
app()->scoped(RequestContext::class, fn() => new RequestContext());

// Instance
app()->instance(ApiClient::class, $client);

// Contextual binding
app()->when(PhotoController::class)
     ->needs(Filesystem::class)
     ->give(fn() => Storage::disk('photos'));

// Tagging
app()->tag([CsvExporter::class, PdfExporter::class], 'exporters');
app()->tagged('exporters');   // all tagged bindings

// Resolve
$gateway = app(PaymentGateway::class);
$gateway = app()->make(PaymentGateway::class);
$gateway = app()->makeWith(PaymentGateway::class, ['key' => 'val']);
$gateway = resolve(PaymentGateway::class);

// Check binding
app()->bound(PaymentGateway::class);
app()->resolved(PaymentGateway::class);

// Call with injection
app()->call([OrderController::class, 'store']);
app()->call(fn(PaymentGateway $gw) => $gw->charge($amount));
```

---

## Service Providers

```php
// app/Providers/AppServiceProvider.php
class AppServiceProvider extends ServiceProvider
{
    // Bindings array (registered before boot)
    public array $bindings = [
        PaymentGateway::class => StripeGateway::class,
    ];

    public array $singletons = [
        ApiClient::class => ApiClient::class,
    ];

    public function register(): void
    {
        // Bind to container — NO facades available here
        $this->app->singleton(ReportGenerator::class, fn($app) => new ReportGenerator(
            $app->make(PdfRenderer::class)
        ));
    }

    public function boot(): void
    {
        // Facades available here
        View::share('appName', config('app.name'));
        Gate::define('admin', fn($user) => $user->is_admin);
        Route::model('post', Post::class);
        Validator::extend('uppercase', fn($a, $v) => strtoupper($v) === $v);
        Model::preventLazyLoading(!$this->app->isProduction());
        DB::prohibitDestructiveCommands($this->app->isProduction());
        Post::observe(PostObserver::class);
    }

    public function provides(): array
    {
        return [ReportGenerator::class];   // for deferred providers
    }
}
```

---

## Collections

```php
$c = collect([1, 2, 3, 4, 5]);
collect(['key' => 'value']);

// Basics
$c->all();                          // plain array
$c->count();
$c->isEmpty();
$c->isNotEmpty();
$c->first();
$c->first(fn($v) => $v > 2);
$c->last();
$c->last(fn($v) => $v < 4);
$c->nth(2);                         // every 2nd item
$c->get(0);
$c->has(0);                         // has key
$c->contains(3);
$c->contains('name', 'John');
$c->doesntContain(6);

// Transformation
$c->map(fn($v) => $v * 2);
$c->mapWithKeys(fn($v, $k) => [$k => $v * 2]);
$c->flatMap(fn($v) => [$v, $v * 2]);
$c->transform(fn($v) => $v * 2);    // mutates in place
$c->filter(fn($v) => $v > 2);
$c->reject(fn($v) => $v > 2);
$c->reduce(fn($carry, $item) => $carry + $item, 0);
$c->each(fn($v) => logger($v));
$c->eachSpread(fn($first, $second) => ...);
$c->tap(fn($c) => logger($c->count()));  // inspect without breaking chain

// Sorting
$c->sort();
$c->sortDesc();
$c->sortBy('name');
$c->sortByDesc('age');
$c->sortBy([['name','asc'],['age','desc']]);
$c->sortKeys();
$c->reverse();
$c->shuffle();

// Grouping / Partitioning
$c->groupBy('type');
$c->groupBy(fn($v) => $v->type);
$c->keyBy('id');
$c->partition(fn($v) => $v > 3);    // returns [$pass, $fail]
$c->chunk(3);
$c->chunkWhile(fn($v, $k, $chunk) => $v === $chunk->last() + 1);
$c->sliding(3);                     // rolling window of 3

// Searching
$c->search(3);                      // key of value
$c->search(fn($v) => $v > 3);
$c->firstWhere('status', 'active');
$c->where('status', 'active');
$c->whereIn('status', ['a','b']);
$c->whereNotIn('status', ['draft']);
$c->whereNull('deleted_at');
$c->whereNotNull('published_at');
$c->whereBetween('age', [18, 65]);

// Aggregates
$c->sum();
$c->sum('price');
$c->sum(fn($v) => $v->price * $v->qty);
$c->avg('price');
$c->min('price');
$c->max('price');
$c->median('price');
$c->mode('price');
$c->countBy(fn($v) => $v->status);

// Slicing
$c->take(3);
$c->skip(2);
$c->slice(2, 3);                    // offset, length
$c->take(-3);                       // last 3
$c->takeWhile(fn($v) => $v < 4);
$c->skipWhile(fn($v) => $v < 3);
$c->takeUntil(fn($v) => $v > 3);
$c->skipUntil(fn($v) => $v > 3);

// Combining
$c->merge([6, 7]);
$c->concat([[6, 7]]);
$c->push(6);
$c->prepend(0);
$c->put('key', 'value');
$c->zip([10, 20, 30]);
$c->combine(['a','b','c']);         // use as values, param as keys
$c->crossJoin(['x','y']);

// Extracting
$c->pluck('name');
$c->pluck('name', 'id');            // key => value
$c->keys();
$c->values();                       // re-index
$c->flatten();
$c->flatten(1);                     // one level deep
$c->collapse();                     // collapse array of arrays

// Unique / Duplicate
$c->unique();
$c->unique('email');
$c->duplicates('email');

// String-like
$c->implode(', ');
$c->implode('name', ', ');
$c->join(', ');
$c->join(', ', ' and ');

// Conversion
$c->toArray();
$c->toJson();
$c->jsonSerialize();

// Higher-order messages
$c->each->save();
$c->filter->isActive();
$c->reject->isExpired();
$c->map->format('Y-m-d');

// Lazy collections (memory-efficient)
LazyCollection::make(function () {
    $handle = fopen('large.csv', 'r');
    while ($line = fgets($handle)) yield $line;
})->chunk(1000)->each(function ($chunk) { /* ... */ });

Post::query()->lazy()->each(fn($post) => ...);
Post::query()->lazyById()->each(fn($post) => ...);
```

---

## Strings — Str

```php
use Illuminate\Support\Str;

Str::of('hello world')             // fluent string wrapper
    ->title()
    ->words(3)
    ->append(' suffix');

// Case
Str::camel('foo_bar');             // fooBar
Str::snake('FooBar');              // foo_bar
Str::kebab('FooBar');              // foo-bar
Str::studly('foo_bar');            // FooBar
Str::title('hello world');         // Hello World
Str::headline('email_verified_at'); // Email Verified At
Str::upper('hello');
Str::lower('HELLO');
Str::ucfirst('hello world');
Str::lcfirst('Hello World');

// Analysis
Str::length('hello');
Str::wordCount('hello world');
Str::contains('hello world', 'world');
Str::contains('hello world', ['world', 'earth']);  // any
Str::containsAll('hello world', ['hello', 'world']);
Str::startsWith('hello', 'hel');
Str::endsWith('hello', 'llo');
Str::is('foo*', 'foobar');         // glob-style match
Str::isUrl('https://example.com');
Str::isEmail('a@b.com');
Str::isUuid('...');
Str::isUlid('...');
Str::isJson('{"a":1}');
Str::isAscii('hello');
Str::ascii('Ä');                   // transliterate → 'A'

// Manipulation
Str::limit('Long string...', 50);
Str::limit('Long string...', 50, '...');
Str::words('Many words here', 3, '...');
Str::before('user@example.com', '@');   // 'user'
Str::after('user@example.com', '@');    // 'example.com'
Str::beforeLast('a/b/c.jpg', '/');      // 'a/b'
Str::afterLast('a/b/c.jpg', '/');       // 'c.jpg'
Str::between('(value)', '(', ')');      // 'value'
Str::betweenFirst('[a][b]', '[', ']');  // 'a'
Str::chopStart('https://foo.com', 'https://');
Str::chopEnd('image.jpeg', '.jpeg');
Str::replace('World', 'Laravel', 'Hello World');
Str::replaceFirst('the', 'a', 'the cat');
Str::replaceLast('the', 'a', 'the cat');
Str::replaceArray('?', ['a','b'], '? and ?');
Str::replaceStart('Hello', 'Hi', 'Hello World');
Str::replaceEnd('World', 'Earth', 'Hello World');
Str::replaceMatches('/[^a-z]/i', '', 'Hello World 123');
Str::remove('o', 'hello world');
Str::start('path/file.txt', '/');       // ensure starts with
Str::finish('path', '/');               // ensure ends with
Str::wrap('value', '"');                // "value"
Str::unwrap('"value"', '"');
Str::pad('5', 5, '0', STR_PAD_LEFT);   // 00005
Str::padLeft('5', 5, '0');
Str::padRight('5', 5, '0');
Str::trim('  hello  ');
Str::ltrim('  hello  ');
Str::rtrim('  hello  ');
Str::squish('  too   many   spaces  ');  // 'too many spaces'
Str::reverse('hello');
Str::repeat('ab', 3);                   // 'ababab'
Str::substr('hello', 1, 3);            // 'ell'
Str::substrCount('hello', 'l');        // 2
Str::substrReplace('hello', 'a', 1, 3); // 'hao'

// URL / IDs
Str::slug('Hello World!');             // 'hello-world'
Str::slug('Héllo', '_');               // 'hello'  
Str::ulid();                           // 01HX...
Str::uuid();                           // 550e8400-e29b...
Str::random(40);                       // random alphanumeric
Str::orderedUuid();
Str::createUuidsUsing(fn() => '...'); // fake UUIDs in tests

// Pluralization
Str::plural('child');                  // 'children'
Str::plural('child', 1);              // 'child'
Str::singular('children');            // 'child'
Str::pluralStudly('UserGroup');        // 'UserGroups'

// Excerpt / Markdown
Str::excerpt('Full text here', 'text', ['radius' => 5]);
Str::markdown('# Hello');             // convert to HTML
Str::inlineMarkdown('**bold**');      // no block wrapping

// Mask
Str::mask('john@example.com', '*', 4);  // john**************
Str::mask('john@example.com', '*', 4, 4); // john****ple.com

// Password
Str::password(32);                    // secure random password
```

---

## Arrays — Arr

```php
use Illuminate\Support\Arr;

Arr::accessible(['a','b']);
Arr::add(['name' => 'John'], 'age', 30);       // only if key missing
Arr::collapse([[1,2],[3,4]]);                  // [[1,2],[3,4]] → [1,2,3,4]
Arr::crossJoin([1,2], ['a','b']);              // cartesian product
Arr::divide(['a' => 1, 'b' => 2]);            // [keys, values]
Arr::dot(['foo' => ['bar' => 'baz']]);        // ['foo.bar' => 'baz']
Arr::undot(['foo.bar' => 'baz']);
Arr::except(['a'=>1,'b'=>2], ['a']);           // ['b'=>2]
Arr::exists($arr, 'key');
Arr::first([1,2,3,4], fn($v) => $v > 2);
Arr::last([1,2,3,4], fn($v) => $v < 3);
Arr::flatten(['a'=>[1,2],'b'=>[3,4]]);        // [1,2,3,4]
Arr::flatten(['a'=>[1,['b'=>2]]], depth: 1);
Arr::forget($arr, 'products.0.price');         // remove by dot path
Arr::get($arr, 'user.name', 'default');
Arr::has($arr, 'user.name');
Arr::has($arr, ['user.name', 'user.email']);   // all must exist
Arr::hasAny($arr, ['user.name', 'user.age']);  // any must exist
Arr::isAssoc(['a'=>1,'b'=>2]);
Arr::isList([1,2,3]);
Arr::join([1,2,3], ', ');                     // '1, 2, 3'
Arr::join([1,2,3], ', ', ' and ');            // '1, 2 and 3'
Arr::keyBy($arr, 'id');
Arr::keys($arr);
Arr::map($arr, fn($v, $k) => $v * 2);
Arr::mapWithKeys($arr, fn($v,$k) => [$v => $k]);
Arr::only($arr, ['a','b']);
Arr::pluck($arr, 'name');
Arr::pluck($arr, 'name', 'id');               // key → value
Arr::prepend($arr, 'zero');
Arr::pull($arr, 'key');                        // get + remove
Arr::query(['name' => 'John', 'age' => 30]);  // 'name=John&age=30'
Arr::random([1,2,3,4,5]);
Arr::random([1,2,3,4,5], 3);                  // 3 random items
Arr::set($arr, 'user.name', 'John');
Arr::shuffle([1,2,3]);
Arr::sort([3,1,2]);
Arr::sort($arr, fn($v) => $v['name']);
Arr::sortDesc([3,1,2]);
Arr::sortRecursive($arr);
Arr::take([1,2,3,4,5], 3);                   // first 3
Arr::take([1,2,3,4,5], -2);                  // last 2
Arr::toCssClasses(['active' => $isActive, 'disabled' => $isDisabled, 'btn']);
Arr::toCssStyles(['color:red' => $isError]);
Arr::where([1,2,3,4], fn($v) => $v > 2);
Arr::whereNotNull([1, null, 2, null, 3]);
Arr::wrap(null);                              // []
Arr::wrap('string');                          // ['string']
Arr::wrap([1,2,3]);                           // [1,2,3]
```

---

## Helpers

```php
// App
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

// Paths
base_path('app/Models');
app_path('Http/Controllers');
config_path('app.php');
database_path('migrations');
public_path('images/logo.png');
resource_path('views/welcome.blade.php');
storage_path('logs/laravel.log');
lang_path('en/messages.php');

// Strings
__(  'messages.welcome', ['name' => 'John']);   // translation
trans('messages.welcome');
trans_choice('messages.apples', 5);
e('<script>');                           // HTML escape
Str::of('hello');
str('hello');                            // shorthand

// Arrays
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

// Auth / User
auth();                                  // Auth facade shortcut
auth()->user();
auth()->id();
auth()->check();
auth()->guest();

// URLs
url('/posts/1');
secure_url('/posts/1');
route('posts.show', $post);
action([PostController::class, 'show'], $post);
asset('images/logo.png');
secure_asset('images/logo.png');
mix('css/app.css');
Vite::asset('resources/images/logo.png');

// Requests / Responses
request();
request('key', 'default');
response()->json($data);
redirect('/home');
back();

// Session / Flash
session('key');
session(['key' => 'value']);
old('email');
old('email', 'default');

// Cache
cache('key');
cache(['key' => 'value'], 600);
cache()->remember('key', 600, fn() => ...);

// Events / Jobs
event(new UserRegistered($user));
dispatch(new ProcessPodcast($podcast));
dispatch_sync(new ProcessPodcast($podcast));

// Misc
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

## Validation

```php
// Manual
$validator = Validator::make($request->all(), [
    'email' => ['required', 'email', 'unique:users,email'],
    'name'  => ['required', 'string', 'max:255'],
]);
if ($validator->fails()) {
    return back()->withErrors($validator)->withInput();
}
$validated = $validator->validated();

// Quick (in controller)
$validated = $request->validate([
    'title' => 'required|max:255',
    'body'  => 'required',
]);

// Custom messages
$request->validate(
    ['title' => 'required'],
    ['title.required' => 'Please enter a title.']
);

// Stopping on first failure
$request->validate(['title' => ['bail', 'required', 'max:255']]);

// Conditional rules
Rule::when($isAdmin, ['sometimes', 'min:10'], ['max:5']);
$request->validate([
    'role' => 'required',
    'admin_code' => Rule::when(fn($input) => $input->role === 'admin', 'required|min:8'),
]);

// Common Rules
'required'
'required_if:field,value'
'required_unless:field,value'
'required_with:foo,bar'
'required_without:foo,bar'
'required_with_all:foo,bar'
'required_without_all:foo,bar'
'nullable'
'sometimes'                         // only validate if present
'filled'                            // must not be empty if present
'present'                           // must be present (even if empty)
'prohibited'
'prohibited_if:field,value'
'prohibited_unless:field,value'
'string'
'integer'
'numeric'
'boolean'
'array'
'array:key1,key2'                   // allowed keys
'list'                              // array with sequential keys
'email'
'email:rfc,dns'
'url'
'active_url'                        // DNS check
'ip'
'ipv4'
'ipv6'
'uuid'
'ulid'
'alpha'
'alpha_num'
'alpha_dash'
'ascii'
'min:3'
'max:255'
'size:10'
'between:1,100'
'digits:4'
'digits_between:4,8'
'decimal:2'
'decimal:1,3'
'gt:other_field'
'gte:other_field'
'lt:other_field'
'lte:other_field'
'same:password'
'different:username'
'confirmed'                         // field_confirmation must match
'in:foo,bar,baz'
'not_in:foo,bar'
Rule::in(['admin','editor'])
Rule::notIn(['banned'])
'exists:table,column'
Rule::exists('users','email')
Rule::exists('users','email')->where('is_active', 1)->whereNull('deleted_at')
'unique:table,column'
Rule::unique('users','email')
Rule::unique('users','email')->ignore($user->id)
Rule::unique('users','email')->where('company_id', $companyId)
'date'
'date_format:Y-m-d'
'before:tomorrow'
'before_or_equal:today'
'after:2024-01-01'
'after_or_equal:start_date'
'date_equals:2025-01-01'
'timezone'
'file'
'image'
'mimes:jpg,png,gif'
'mimetypes:image/jpeg,image/png'
'max:2048'                          // kilobytes for files
'min:1'                             // kilobytes
'dimensions:min_width=100,min_height=100'
'dimensions:ratio=3/2'
'extensions:jpg,png'               // file extension whitelist
'password'
'password:min=8,letters,numbers,symbols,uncompromised'
'regex:/^[a-z]+$/i'
'not_regex:/bad_pattern/'
'json'
'lowercase'
'uppercase'
'starts_with:foo,bar'
'ends_with:foo,bar'
'doesnt_start_with:admin'
'doesnt_end_with:.exe'
'multiple_of:5'
'missing'
'missing_if:field,value'
'missing_unless:field,value'
'missing_with:other'
'exclude'
'exclude_if:field,value'
'exclude_unless:field,value'
'exclude_with:field'
'exclude_without:field'
Rule::forEach(fn($v,$attr,$data) => ['string','max:100'])

// Custom rule class
class Uppercase implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper($value) !== $value) {
            $fail("The :attribute must be uppercase.");
        }
    }
}
$request->validate(['name' => ['required', new Uppercase]]);
```

---

## Events & Listeners

```php
// Create
php artisan make:event PostPublished
php artisan make:listener SendPublishNotification --event=PostPublished

// Event class
class PostPublished
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public function __construct(public Post $post) {}
    public function broadcastOn(): array { return []; }
}

// Listener class
class SendPublishNotification implements ShouldQueue
{
    use InteractsWithQueue;
    public int $tries = 3;
    public int $backoff = 60;

    public function handle(PostPublished $event): void
    {
        // $event->post
    }

    public function failed(PostPublished $event, \Throwable $e): void
    {
        // handle failure
    }
}

// Register (AppServiceProvider::boot — L11+ auto-discovers)
Event::listen(PostPublished::class, SendPublishNotification::class);
Event::listen(PostPublished::class, function (PostPublished $event) { ... });
Event::listen('eloquent.created: *', fn($event, $data) => ...);  // wildcard

// Dispatch
PostPublished::dispatch($post);
event(new PostPublished($post));
PostPublished::dispatchIf($condition, $post);
PostPublished::dispatchUnless($condition, $post);

// Fake in tests
Event::fake();
Event::fake([PostPublished::class]);
Event::assertDispatched(PostPublished::class);
Event::assertDispatched(PostPublished::class, fn($e) => $e->post->id === 1);
Event::assertDispatchedTimes(PostPublished::class, 2);
Event::assertNotDispatched(PostPublished::class);
Event::assertNothingDispatched();
```

---

## Jobs & Queues

```php
php artisan make:job ProcessPodcast
php artisan queue:table && php artisan migrate    # database driver

class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int    $tries       = 3;
    public int    $maxExceptions = 1;
    public int    $timeout     = 60;
    public int    $backoff     = 30;                    // seconds before retry
    public int    $backoff     = [30, 60, 120];         // exponential backoff
    public bool   $deleteWhenMissingModels = true;
    public string $queue       = 'podcasts';
    public string $connection  = 'redis';
    public ?int   $uniqueFor   = 3600;                  // unique lock (ShouldBeUnique)
    public string $afterCommit = true;                   // dispatch after DB commit

    public function __construct(private Podcast $podcast) {}

    public function handle(AudioProcessor $processor): void
    {
        $processor->process($this->podcast);
    }

    public function retryUntil(): DateTime
    {
        return now()->addHour();
    }

    public function failed(\Throwable $e): void
    {
        // notify, log, etc.
    }

    public function middleware(): array
    {
        return [new WithoutOverlapping($this->podcast->id)];
    }
}

// Dispatch
ProcessPodcast::dispatch($podcast);
ProcessPodcast::dispatch($podcast)->onQueue('high');
ProcessPodcast::dispatch($podcast)->onConnection('redis');
ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));
ProcessPodcast::dispatchIf($condition, $podcast);
ProcessPodcast::dispatchAfterResponse($podcast);    // after HTTP response sent
dispatch(new ProcessPodcast($podcast));
dispatch_sync(new ProcessPodcast($podcast));         // run synchronously

// Chaining
ProcessPodcast::withChain([
    new OptimizePodcast,
    new ReleasePodcast,
])->dispatch($podcast);

Bus::chain([
    new ProcessPodcast($podcast),
    new OptimizePodcast($podcast),
    new ReleasePodcast($podcast),
])->catch(fn(\Throwable $e) => logger()->error($e))
  ->dispatch();

// Batching
$batch = Bus::batch([
    new ProcessPodcast($podcasts[0]),
    new ProcessPodcast($podcasts[1]),
])->then(fn(Batch $batch) => logger('All done'))
  ->catch(fn(Batch $batch, \Throwable $e) => logger('Error'))
  ->finally(fn(Batch $batch) => logger('Batch complete'))
  ->onQueue('default')
  ->dispatch();

$batch->id;
$batch->progress();
$batch->finished();
$batch->cancelled();
$batch->cancel();
$batch->add([new ProcessPodcast($p)]);  // add more jobs

// Queue facade
Queue::push(new ProcessPodcast($podcast));
Queue::later(60, new ProcessPodcast($podcast));
Queue::bulk([new Job1, new Job2]);
Queue::size('default');
```

---

## Task Scheduling

```php
// routes/console.php (L11+ — replaces App\Console\Kernel)
Schedule::call(fn() => DB::table('logs')->delete())->daily();
Schedule::command('inspire')->hourly()->withoutOverlapping();
Schedule::command('emails:send')->everyFiveMinutes()->runInBackground();
Schedule::job(new ProcessPodcast)->everyFifteenMinutes()->onQueue('default');
Schedule::exec('node /home/forge/script.js')->daily();

// Frequency
->everySecond()
->everyTwoSeconds()
->everyFiveSeconds()
->everyTenSeconds()
->everyThirtySeconds()
->everyMinute()
->everyTwoMinutes()
->everyFiveMinutes()
->everyTenMinutes()
->everyFifteenMinutes()
->everyThirtyMinutes()
->hourly()
->hourlyAt(17)                      // at :17 past each hour
->everyOddHour()
->everyTwoHours()
->daily()
->dailyAt('13:00')
->twiceDaily(1, 13)
->weeklyOn(Schedule::MONDAY, '8:00')
->monthly()
->monthlyOn(4, '15:00')
->quarterly()
->yearly()
->cron('* * * * *')                 // custom cron expression

// Constraints
->weekdays()
->weekends()
->mondays()
->tuesdays()
->wednesdays()
->thursdays()
->fridays()
->saturdays()
->sundays()
->between('8:00', '17:00')
->unlessBetween('23:00', '4:00')
->when(fn() => Carbon::now()->day === 1)
->skip(fn() => Carbon::now()->isHoliday())
->environments(['production'])
->onOneServer()                     // only one server (requires cache driver)

// Output
->sendOutputTo('/tmp/out.log')
->appendOutputTo('/tmp/out.log')
->emailOutputTo('ops@example.com')
->emailOutputOnFailure('ops@example.com')

// Hooks
->before(fn() => logger('starting'))
->after(fn() => logger('done'))
->onSuccess(fn() => Notification::send(...))
->onFailure(fn() => Notification::send(...))
->pingBefore('https://healthcheck.io/ping/...')
->thenPing('https://healthcheck.io/ping/.../complete')
->withoutOverlapping()
->withoutOverlapping(10)            // lock expires in 10 min
->runInBackground()
```

---

## Testing — Pest / PHPUnit

```php
// PHPUnit Feature test
class PostTest extends TestCase
{
    use RefreshDatabase;           // wrap in transaction, rollback after each test
    // use DatabaseMigrations;     // full migrate:fresh each test (slow)
    // use DatabaseTruncation;     // truncate tables (faster than migrations)

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_user_can_view_posts(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
                         ->get(route('posts.show', $post));

        $response->assertStatus(200);
        $response->assertOk();
        $response->assertViewIs('posts.show');
        $response->assertViewHas('post', $post);
        $response->assertSee($post->title);
        $response->assertDontSee('Draft');
    }
}

// Pest equivalent
it('shows posts to authenticated users', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->get(route('posts.show', $post))
        ->assertOk()
        ->assertViewIs('posts.show')
        ->assertSee($post->title);
});

// HTTP Assertions
$response->assertOk();                       // 200
$response->assertCreated();                  // 201
$response->assertAccepted();                 // 202
$response->assertNoContent();                // 204
$response->assertNotFound();                 // 404
$response->assertForbidden();                // 403
$response->assertUnauthorized();             // 401
$response->assertUnprocessable();            // 422
$response->assertStatus(302);
$response->assertRedirect('/home');
$response->assertRedirectToRoute('home');
$response->assertRedirectContains('/posts');
$response->assertHeader('Content-Type', 'application/json');
$response->assertJsonPath('data.0.name', 'John');
$response->assertJsonCount(3, 'data');
$response->assertJsonMissingPath('data.0.password');
$response->assertJsonStructure(['data' => [['id','name','email']]]);
$response->assertJson(fn(AssertableJson $j) =>
    $j->where('id', 1)
      ->where('name', 'John')
      ->missing('password')
      ->has('posts', 3)
      ->has('posts.0', fn($j) => $j->where('title', 'Hello')->etc())
      ->etc()                                // allow extra keys
);
$response->assertSessionHas('status', 'done');
$response->assertSessionMissing('error');
$response->assertCookie('name', 'value');
$response->assertCookieMissing('name');

// Database assertions
$this->assertDatabaseHas('posts', ['title' => 'Hello', 'user_id' => 1]);
$this->assertDatabaseMissing('posts', ['title' => 'Deleted']);
$this->assertDatabaseCount('posts', 5);
$this->assertDatabaseEmpty('posts');
$this->assertSoftDeleted('posts', ['id' => 1]);
$this->assertNotSoftDeleted('posts', ['id' => 1]);
$this->assertModelExists($post);
$this->assertModelMissing($post);

// Mocking
$this->mock(PaymentGateway::class, function (MockInterface $mock) {
    $mock->shouldReceive('charge')->once()->with(100)->andReturn(true);
});
$this->partialMock(PaymentGateway::class, ...);
$this->spy(PaymentGateway::class);

// Mail / Notifications / Events / Queue (facades)
Mail::fake();
Mail::assertSent(OrderShipped::class);
Mail::assertSent(OrderShipped::class, fn($m) => $m->hasTo('a@b.com'));
Mail::assertSentCount(2);
Mail::assertNotSent(OrderShipped::class);
Mail::assertQueued(OrderShipped::class);
Mail::assertNothingSent();

Notification::fake();
Notification::assertSentTo($user, InvoicePaid::class);
Notification::assertNothingSent();
Notification::assertCount(3);

Queue::fake();
Queue::assertPushed(ProcessPodcast::class);
Queue::assertPushed(ProcessPodcast::class, fn($job) => $job->podcast->id === 1);
Queue::assertPushedOn('high', ProcessPodcast::class);
Queue::assertPushedWithChain(ProcessPodcast::class, [OptimizePodcast::class]);
Queue::assertNotPushed(ProcessPodcast::class);
Queue::assertCount(2);

Storage::fake('avatars');
Storage::disk('avatars')->assertExists('photo.jpg');
Storage::disk('avatars')->assertMissing('photo.jpg');

// Time control
$this->freezeTime();
$this->travelTo(now()->addDays(5));
$this->travelBack();
$this->travel(5)->days();

// Pest-specific helpers
pest()->extends(TestCase::class)->use(RefreshDatabase::class)->in('Feature');

describe('posts', function () {
    beforeEach(fn() => $this->user = User::factory()->create());

    it('can be created', function () {
        actingAs($this->user)
            ->post(route('posts.store'), ['title' => 'Hello', 'body' => 'World'])
            ->assertCreated();
        expect(Post::count())->toBe(1);
    });

    it('requires authentication')->get('/posts')->assertRedirect('/login');
});

// Expectations (Pest)
expect($value)->toBe(42);
expect($value)->toEqual('42');
expect($value)->toBeTrue();
expect($value)->toBeFalse();
expect($value)->toBeNull();
expect($value)->toBeEmpty();
expect($value)->toContain('hello');
expect($arr)->toHaveCount(3);
expect($arr)->toHaveKey('name');
expect($obj)->toHaveProperty('title', 'Hello');
expect($value)->toBeGreaterThan(0);
expect($value)->toBeLessThan(100);
expect($value)->toBeInstanceOf(User::class);
expect(fn() => risky())->toThrow(RuntimeException::class);
expect($value)->when($condition, fn($e) => $e->toBeTrue());
```

---

*Last updated: 2026 · Laravel 13 · PHP 8.2+*
*Pull requests welcome: [github.com/thatobabusi/laravel-13-cheat-sheet](https://github.com/thatobabusi/laravel-13-cheat-sheet)*
