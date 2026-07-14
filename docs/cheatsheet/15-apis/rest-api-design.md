# REST API Design Patterns

## API Versioning

### URL Versioning
```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('posts', PostV1Controller::class);
    Route::apiResource('users', UserV1Controller::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('posts', PostV2Controller::class);
    Route::apiResource('users', UserV2Controller::class);
});
```

### Header Versioning
```php
// Middleware to detect version
class ApiVersionMiddleware
{
    public function handle($request, Closure $next)
    {
        $version = $request->header('Accept-Version', 'v1');
        $request->version = $version;
        return $next($request);
    }
}
```

## Resource Classes

### API Resource
```bash
php artisan make:resource PostResource
```

### Resource Structure
```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'author' => new UserResource($this->author),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}

// Usage
return PostResource::collection($posts);
return new PostResource($post);
```

### Conditional Fields
```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->when(
                $request->user()?->can('view', $this->resource),
                $this->content
            ),
            'draft' => $this->when(
                auth()->check() && auth()->id() === $this->user_id,
                $this->is_draft
            ),
        ];
    }
}
```

## Pagination & Filtering

### Paginated API Response
```php
public function index()
{
    $posts = Post::query()
        ->when(request('search'), function ($q) {
            $q->where('title', 'like', '%' . request('search') . '%');
        })
        ->when(request('user_id'), function ($q) {
            $q->where('user_id', request('user_id'));
        })
        ->paginate(request('per_page', 15));

    return PostResource::collection($posts);
}

// API Response
{
    "data": [...],
    "links": {
        "first": "...",
        "last": "...",
        "prev": "...",
        "next": "..."
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 10,
        "per_page": 15,
        "to": 15,
        "total": 150
    }
}
```

### Cursor Pagination
```php
$posts = Post::orderBy('id')->cursorPaginate(15);

// More efficient for large datasets
```

## Error Responses

### Consistent Error Format
```php
// app/Http/Controllers/Controller.php
protected function errorResponse($message, $status = 400, $data = [])
{
    return response()->json([
        'success' => false,
        'message' => $message,
        'errors' => $data,
    ], $status);
}

// Exception handler
public function render($request, Throwable $exception)
{
    if ($request->wantsJson()) {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $exception->errors(),
            ], 422);
        }

        return response()->json([
            'success' => false,
            'message' => $exception->getMessage(),
        ], 500);
    }
}
```

### HTTP Status Codes
```
200 OK           - Success
201 Created      - Resource created
204 No Content   - Success with no body
400 Bad Request  - Invalid request
401 Unauthorized - Not authenticated
403 Forbidden    - Not authorized
404 Not Found    - Resource not found
422 Unprocessable Entity - Validation error
429 Too Many Requests - Rate limited
500 Server Error - Unexpected error
```

## Request Validation

### Form Request
```bash
php artisan make:request StorePostRequest
```

### Validate API Requests
```php
class StorePostRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Title is required',
            'content.required' => 'Content cannot be empty',
        ];
    }
}

// In controller
public function store(StorePostRequest $request)
{
    $post = Post::create($request->validated());
    return new PostResource($post);
}
```

## Filtering & Sorting

### Advanced Filtering
```php
$posts = Post::query()
    ->when(request('filter.user_id'), fn($q) =>
        $q->where('user_id', request('filter.user_id'))
    )
    ->when(request('filter.published'), fn($q) =>
        $q->where('published', request('filter.published'))
    )
    ->when(request('sort'), fn($q) =>
        $q->orderBy(request('sort'), request('order', 'asc'))
    )
    ->get();
```

## CORS Handling

### Configure CORS
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
```

## API Documentation

### Using OpenAPI/Swagger
```bash
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

### Document Endpoints
```php
/**
 * @OA\Get(
 *     path="/api/posts",
 *     summary="Get all posts",
 *     @OA\Response(response=200, description="Success"),
 * )
 */
public function index()
{
    return PostResource::collection(Post::all());
}
```

## See Also
- [[api-authentication]]
- [[rate-limiting-throttling]]
- [[pagination-filtering]]
