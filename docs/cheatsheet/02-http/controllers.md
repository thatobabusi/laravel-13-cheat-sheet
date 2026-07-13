# Controllers

> Controllers contain the logic for handling application requests.
> **Part of:** [[Laravel 13 Cheat Sheet]] | **Category:** HTTP

## Basic Controller

```php
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
```

## Single-Action Controller

```php
class ShowDashboard extends Controller
{
    public function __invoke(): View
    {
        return view('dashboard');
    }
}

// Route
Route::get('/dashboard', ShowDashboard::class);
```

## Dependency Injection in Constructor

```php
class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service,
    ) {}
}
```

---

**See Also:** [[requests]] | [[responses]] | [[routing]]
